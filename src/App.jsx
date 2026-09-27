
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [course, setCourse] = useState('')
  const [year, setYear] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      setMessage('Could not load students: ' + error.message)
    } else {
      setStudents(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    getStudents()
  }, [])

  async function addStudent(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('students')
      .insert([{
        name,
        email,
        course,
        year: year ? Number(year) : null
      }])

    if (error) {
      setMessage('Could not add student: ' + error.message)
    } else {
      setMessage('Student added successfully!')
      setName('')
      setEmail('')
      setCourse('')
      setYear('')
      setShowForm(false)
      await getStudents()
    }

    setSaving(false)
  }

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.course} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const aimlCount = students.filter(
    (student) => student.course.toLowerCase() === 'aiml'
  ).length

  const coursesCount = new Set(
    students.map((student) => student.course)
  ).size

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span>StudentHub</span>
        </div>

        <p className="nav-heading">MENU</p>
        <div className="nav-link active">▦ <span>Dashboard</span></div>
        <div className="nav-link">♙ <span>Students</span></div>
        <div className="nav-link">▤ <span>Courses</span></div>

        <div className="sidebar-bottom">
          <div className="profile-avatar">R</div>
          <div>
            <strong>Renuka M</strong>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <div className="top-tag">Student Management</div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">♙</div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
            <small>Registered students</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">✦</div>
            <p>AIML Students</p>
            <h2>{aimlCount}</h2>
            <small>Enrolled in AIML</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">▤</div>
            <p>Total Courses</p>
            <h2>{coursesCount}</h2>
            <small>Unique courses</small>
          </div>
        </section>

        <section className="content-card">
          <div className="section-heading">
            <div>
              <h2>Student Directory</h2>
              <p>View and manage student records</p>
            </div>
            <button className="add-button" onClick={() => {
              setShowForm(!showForm)
              setMessage('')
            }}>
              + Add Student
            </button>
          </div>

          {showForm && (
            <form className="student-form" onSubmit={addStudent}>
              <h3>Add New Student</h3>
              <div className="form-grid">
                <label>
                  Student Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                  />
                </label>
                <label>
                  Course
                  <select value={course} onChange={(e) => setCourse(e.target.value)} required>
                    <option value="">Select course</option>
                    <option value="AIML">AIML</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="ISE">ISE</option>
                  </select>
                </label>
                <label>
                  Year
                  <select value={year} onChange={(e) => setYear(e.target.value)} required>
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-button" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Student'}
                </button>
              </div>
            </form>
          )}

          {message && <p className="message">{message}</p>}

          <div className="table-tools">
            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕  Search name, email, or course..."
            />
            <span>{filteredStudents.length} records</span>
          </div>

          {loading ? (
            <p className="empty-state">Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="empty-state">No matching students found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>STUDENT</th>
                    <th>EMAIL</th>
                    <th>COURSE</th>
                    <th>YEAR</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>#{student.id}</td>
                      <td><strong>{student.name}</strong></td>
                      <td>{student.email}</td>
                      <td><span className="course-badge">{student.course}</span></td>
                      <td>{student.year ? `Year ${student.year}` : '—'}</td>
                      <td><span className="status">Active</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <footer>StudentHub · React + Supabase</footer>
      </main>
    </div>
  )
}

export default App
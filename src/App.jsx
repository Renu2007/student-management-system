
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error(error.message)
      } else {
        setStudents(data)
      }
      setLoading(false)
    }

    getStudents()
  }, [])

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.course} ${student.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="container">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage and view student records</p>
      </header>

      <section className="student-card">
        <h2>Student List ({filteredStudents.length})</h2>

        <input
          type="text"
          placeholder="Search by name, course, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p>Loading students...</p>
        ) : filteredStudents.length === 0 ? (
          <p>No matching students found.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.year}</td>
                    <td><span className="status">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
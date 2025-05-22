import React from 'react'
import { useContext } from 'react'
import { CartContext } from './CartContext';
const Home = () => {
    const{cartcount,setcartcount}=useContext(CartContext);
   
      const data = [
        { id: 1, name: "Mathan", class: "BE.IT", sec: "B" },
        { id: 2, name: "Pravin", class: "Ba.Economics", sec: "A" },
      ];
    
  return (
    <>
    <table border="1" style={{ borderCollapse: "collapse", width: "50%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Class</th>
          <th>Section</th>
        </tr>
      </thead>
      <tbody>
        {data.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>{student.name}</td>
            <td>{student.class}</td>
            <td>{student.sec}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <h1>
        {cartcount}
    </h1>
    <button onClick={() => setcartcount(c => c + 1)}>addcart</button>

    <table border="1" style={{width:"100%",borderCollapse:"collapse",border:"2px red solid"}}>
      <thead>
        <tr>
          <th>Department</th>
          <th>Roll number</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td >
            Information Technology
          </td>
          <td>
            2138010030
          </td>
          <td>
            Mathankumar
          </td>
        </tr>
      </tbody>
    </table>
    </>
  )
}

export default Home
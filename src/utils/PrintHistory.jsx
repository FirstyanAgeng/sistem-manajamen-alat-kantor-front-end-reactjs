import React, { forwardRef } from "react";
import moment from "moment";

// Wrap the functional component with React.forwardRef
const PrintableHistory = forwardRef(({ history }, ref) => {
  return (
    <div ref={ref}>
      <table className="table table-inner-bordered m-2">
        <thead>
          <tr>
            <th>No</th>
            <th>Admin</th>
            <th>Peminjam</th>
            <th>Alat</th>
            <th>Status</th>
            <th>Deskripsi</th>
            <th>Tanggal Pinjam</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.created_by.name}</td>
              <td>{item.borrowings.user.name}</td>
              <td>{item.borrowings.equipment.name}</td>
              <td>{item.borrowings.status}</td>
              <td>{item.description}</td>
              <td>{moment(item.borrowings.created_at).format("YYYY-MM-DD")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintableHistory;

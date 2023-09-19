import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Cookies from "js-cookie";
import PrintableHistory from "../utils/PrintHistory";
import { useReactToPrint } from "react-to-print";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { getCSRFToken } from "../utils/authentication";

const HistoryList = () => {
  // Add a ref for the PrintableHistory component
  const componentRef = useRef();

  // Function to trigger printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const moment = require("moment");
  const [showModal, setShowModal] = useState(false);
  const [History, setHistory] = useState([]);
  const token = Cookies.get("authToken");
  const csrftoken = getCSRFToken("csrftoken");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil daftar resep dari API yang memerlukan autentikasi
    axios
      .get("http://127.0.0.1:8000/api/equipment/history/", {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrftoken,
        },
      })
      .then((response) => {
        setHistory(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle kesalahan autentikasi atau kesalahan lainnya
        console.log(error);
        Swal.fire(error);
        setIsLoading(false);
      });
  }, [csrftoken, token]);

  const deleteEquipment = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/equipment/history/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrftoken,
        },
      })
      .then((response) => {
        // Hapus resep dari daftar setelah berhasil dihapus
        setHistory(History.filter((equipment) => equipment.id !== id));
        Swal.fire("Selamat, Data Berhasil dihapus");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="d-flex w-100 h-100">
          <Spinner
            animation="border"
            role="status"
            className="mx-auto my-5"
          ></Spinner>
        </div>
      ) : (
        <div style={{ marginTop: 65 }}>
          <div className="container-fluid">
            <h3 className="text-center">History Peminjaman</h3>
            <div className="w-full mw-full">
              <Button onClick={() => setShowModal(true)}>Print History</Button>
              {/* Render the modal */}
              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="xl"
              >
                <Modal.Header closeButton>
                  <Modal.Title>History Peminjaman</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* Render the PrintableHistory component inside the modal */}
                  <PrintableHistory ref={componentRef} history={History} />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="primary" onClick={handlePrint}>
                    Print
                  </Button>
                </Modal.Footer>
              </Modal>

              <div className="card p-0 bg-very-dark-dm">
                <div className="table-responsive">
                  <table className="table table-inner-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Admin</th>
                        <th>Peminjam</th>
                        <th>Alat</th>
                        <th>Status</th>
                        <th>Deskripsi</th>
                        <th>Tanggal</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {History.map((history, index) => {
                        return (
                          <tr key={history.id}>
                            <td>{index + 1}</td>
                            <td>{history.created_by.name}</td>
                            <td>{history.borrowings.user.name}</td>
                            <td>{history.borrowings.equipment.name}</td>
                            <td>{history.borrowings.status}</td>
                            <td>{history.description}</td>
                            <td>
                              {moment(history.borrowings.created_at).format(
                                "YYYY-MM-DD"
                              )}
                            </td>

                            <td>
                              <div className="row">
                                <div className="col-1">
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteEquipment(history.id)}
                                  >
                                    ❌
                                  </span>
                                </div>
                                {/* update feature */}
                                {/* <div className="col-1">
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleUpdateClick(history.id)}
                                >
                                  ✏️
                                </span>
                              </div> */}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HistoryList;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Container } from "react-bootstrap";
import Cookies from "js-cookie";
import Layout from "../components/Layout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { getCSRFToken } from "../utils/authentication";

const AddBorrowing = () => {
  const navigate = useNavigate();

  const [borrowingData, setBorrowingData] = useState({
    created_at: "",
    created_by: "",
    equipment: "",
    user: "",
    borrowing_until: "",
    status: "Peminjaman",
    return_date: null,
  });

  // Keperluan fetch data
  const [users, setUsers] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const token = Cookies.get("authToken");
  const csrfToken = getCSRFToken("csrftoken");

  useEffect(() => {
    // Ambil daftar users dari API
    axios
      .get("http://127.0.0.1:8000/api/equipment/users/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Ambil daftar equipment dari API
    axios
      .get("http://127.0.0.1:8000/api/equipment/list/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setEquipmentList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestData = {
      ...borrowingData,
    };
    axios
      .post("http://127.0.0.1:8000/api/equipment/borrowing/", requestData, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json", // Set tipe konten ke "application/json"
        },
      })
      .then((response) => {
        console.log("Peminjaman berhasil ditambahkan", response.data);
        Swal.fire("Data Sudah Tersimpan");
        navigate("/borrow");
        // Redirect ke halaman lain jika diperlukan
      })
      .catch((error) => {
        console.log("Response from the server:", error.response);
        console.log("CSRF token:", csrfToken);
        console.log("Request data:", requestData);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowingData({
      ...borrowingData,
      [name]: value,
    });
  };

  return (
    <Layout>
      <div className="row mt-3">
        <div className="col-6">
          {" "}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="created_at">
              <Form.Label>Tanggal Dibuat</Form.Label>
              <Form.Control
                type="date"
                name="created_at"
                value={borrowingData.created_at}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="created_by">
              <Form.Label>Dibuat Oleh</Form.Label>
              <Form.Control
                as="select"
                name="created_by"
                value={borrowingData.created_by}
                onChange={handleInputChange}
              >
                <option value="">Pilih Pengguna</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="user">
              <Form.Label>Peminjam</Form.Label>
              <Form.Control
                as="select"
                name="user"
                value={borrowingData.user}
                onChange={handleInputChange}
              >
                <option value="">Pilih Pengguna Peminjam</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="equipment">
              <Form.Label>Alat</Form.Label>
              <Form.Control
                as="select"
                name="equipment"
                value={borrowingData.equipment}
                onChange={handleInputChange}
              >
                <option value="">Pilih Alat</option>
                {equipmentList.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="borrowing_until">
              <Form.Label>Tanggal Peminjaman Berakhir</Form.Label>
              <Form.Control
                type="date"
                name="borrowing_until"
                value={borrowingData.borrowing_until}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={borrowingData.status}
                onChange={handleInputChange}
              >
                <option value="Peminjaman">Peminjaman</option>
                <option value="Pengembalian">Pengembalian</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-3">
              Simpan
            </Button>
          </Form>
        </div>
        <div className="col-6 d-flex my-auto mx-auto">
          <Container>
            <h2 className="text-center">Tambah Peminjaman</h2>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default AddBorrowing;

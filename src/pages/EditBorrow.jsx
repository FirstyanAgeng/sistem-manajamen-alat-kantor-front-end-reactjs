import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { getCSRFToken } from "../utils/authentication";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Layout from "../components/Layout";

const EditBorrowing = () => {
  const navigate = useNavigate();
  const csrfToken = getCSRFToken("csrftoken");
  const token = Cookies.get("authToken");

  const { id } = useParams();
  const [borrowingData, setBorrowingData] = useState({
    status: "",
    return_date: "",
  });

  const [otherData, setOtherData] = useState({
    created_at: "",
    created_by: "",
    equipment: "",
    user: "",
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/equipment/borrowing/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
        },
      })
      .then((response) => {
        const { status, return_date } = response.data;
        setBorrowingData({ status, return_date });

        // Ambil data lain yang ingin ditampilkan
        const { created_at, created_by, equipment, user } = response.data;
        setOtherData({ created_at, created_by, equipment, user });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBorrowingData({
      ...borrowingData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedData = {
      status: borrowingData.status,
      return_date: borrowingData.return_date,
    };

    axios
      .patch(
        `http://127.0.0.1:8000/api/equipment/borrowing/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Data peminjaman berhasil diubah", response.data);
        Swal.fire("Data berhasil di update");
        navigate("/borrow");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(updatedData);
        } else {
          console.log(error.message);
        }
      });
  };

  return (
    <Layout>
      <h3>Edit Peminjaman</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={borrowingData.status}
            onChange={handleInputChange}
          >
            <option value="Peminjaman">Peminjaman</option>
            <option value="Pengembalian">Pengembalian</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="return_date">
          <Form.Label>Tanggal Pengembalian</Form.Label>
          <Form.Control
            type="date"
            name="return_date"
            value={borrowingData.return_date}
            onChange={handleInputChange}
          />
        </Form.Group>

        {/* Data lain yang hanya untuk dilihat */}
        <div>
          <p>
            <strong>Tanggal Dibuat:</strong> {otherData.created_at}
          </p>
          <p>
            <strong>Dibuat Oleh:</strong> {otherData.created_by.name}
          </p>
          <p>
            <strong>Alat:</strong> {otherData.equipment.name}
          </p>
          <p>
            <strong>Peminjam:</strong> {otherData.user.name}
          </p>
        </div>

        <Button type="submit" variant="primary">
          Simpan
        </Button>
      </Form>
    </Layout>
  );
};

export default EditBorrowing;

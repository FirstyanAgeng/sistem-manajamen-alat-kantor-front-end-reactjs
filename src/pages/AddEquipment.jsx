import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { getCSRFToken } from "../utils/authentication";
import Layout from "../components/Layout";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AddEquipment = () => {
  const navigate = useNavigate();
  const csrfToken = getCSRFToken("csrftoken");
  const token = Cookies.get("authToken");

  const [equipmentData, setEquipmentData] = useState({
    name: "",
    description: "",
    stock_available: "",
    image: null, // Untuk mengunggah gambar
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEquipmentData({
      ...equipmentData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEquipmentData({
      ...equipmentData,
      image: imageFile,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", equipmentData.name);
    formData.append("description", equipmentData.description);
    formData.append("stock_available", equipmentData.stock_available);
    formData.append("image", equipmentData.image);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/equipment/list/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Data alat berhasil ditambahkan", response.data);
      Swal.fire("Data Sudah Tersimpan");
      navigate("/equipment");
    } catch (error) {
      console.error("Gagal menambahkan data alat:", error);
      Swal.fire("Terjadi kesalahan saat menyimpan data.");
    }
  };

  return (
    <Layout>
      <div>
        <h3>Tambah Alat</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name">
            <Form.Label>Nama Alat</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={equipmentData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={equipmentData.description}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="stock_available">
            <Form.Label>Stok Tersedia</Form.Label>
            <Form.Control
              type="number"
              name="stock_available"
              value={equipmentData.stock_available}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Gambar</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary">
            Simpan
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default AddEquipment;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ADD_EQUIPMENT } from "../router";
import DataTable from "react-data-table-component"; // Import React DataTables
import { getCSRFToken } from "../utils/authentication";

const EquipmentList = () => {
  const [Equipment, setEquipment] = useState([]);
  const [searchText, setSearchText] = useState(""); // State untuk pencarian
  const token = Cookies.get("authToken");
  const navigate = useNavigate();
  const csrfToken = getCSRFToken("csrftoken");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil daftar resep dari API yang memerlukan autentikasi
    axios
      .get("http://127.0.0.1:8000/api/equipment/list/", {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
        },
      })
      .then((response) => {
        setEquipment(response.data);
        setIsLoading(false); // Data sudah dimuat, atur isLoading menjadi false
      })
      .catch((error) => {
        // Handle kesalahan autentikasi atau kesalahan lainnya
        console.log(error);
        setIsLoading(false); // Atur isLoading menjadi false jika terjadi kesalahan
      });
  }, [token, csrfToken]);

  const deleteEquipment = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/equipment/list/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrfToken,
        },
      })
      .then((response) => {
        // Hapus resep dari daftar setelah berhasil dihapus
        setEquipment(Equipment.filter((equipment) => equipment.id !== id));
        Swal.fire("Data Berhasil dihapus");
      })
      .catch((error) => {
        Swal.fire("Error" + error.response);
        console.log(error);
      });
  };

  // Kolom-kolom yang akan ditampilkan pada tabel
  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: "Nama",
      selector: (row) => row.name, // Use selector function
      sortable: true,
    },
    {
      name: "Deskripsi",
      selector: (row) => row.description, // Use selector function
      sortable: true,
    },
    {
      name: "Stok Tersedia",
      selector: (row) => row.stock_available, // Use selector function
      sortable: true,
    },
    {
      name: "Gambar",
      cell: (row) => <img src={row.image} alt="" width="150" height="150" />,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <div className="row">
          <div className="col-1">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => deleteEquipment(row.id)}
            >
              ❌
            </span>
          </div>
          <div className="col-1">
            <Link
              to={`/edit-equipment/${row.id}`}
              style={{ textDecoration: "none" }}
            >
              <span style={{ cursor: "pointer" }}>✏️</span>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  // Fungsi untuk melakukan pencarian
  const filteredEquipment = Equipment.filter((equipment) =>
    equipment.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Layout>
      {isLoading ? ( // Tampilkan spinner jika isLoading adalah true
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
            <h3 className="text-center">List Alat Kantor</h3>
            <div className="d-flex">
              <Button
                className="btn btn-success me-auto"
                onClick={() => navigate(ADD_EQUIPMENT)}
              >
                Tambah
              </Button>
              <input
                type="text"
                placeholder="Cari..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="w-full mw-full">
              <DataTable
                columns={columns}
                data={filteredEquipment} // Menampilkan data yang sudah difilter
                pagination
                paginationPerPage={10} // Jumlah item per halaman
                highlightOnHover
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EquipmentList;

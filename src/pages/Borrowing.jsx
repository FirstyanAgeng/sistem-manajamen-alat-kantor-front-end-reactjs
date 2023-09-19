import Layout from "../components/Layout";
import axios from "axios";
import { Button, Spinner, Badge } from "react-bootstrap";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ADD_BORROW } from "../router";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getCSRFToken } from "../utils/authentication";

const Borrowing = () => {
  const moment = require("moment");
  const navigate = useNavigate();
  const [Borrow, setBorrow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = Cookies.get("authToken");
  const csrftoken = getCSRFToken("csrftoken");
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/equipment/borrowing/", {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrftoken,
        },
      })
      .then((response) => {
        setBorrow(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        Swal.fire(error);
      });
  }, [token, csrftoken]);

  const deleteBorrow = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/equipment/borrowing/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          "X-CSRFToken": csrftoken,
        },
      })
      .then((response) => {
        setBorrow(Borrow.filter((borrow) => borrow.id !== id));
        Swal.fire("Data Berhasil Dihapus");
      })
      .catch((error) => {
        console.log("error : ", error.response);
      });
  };

  // const handleUpdateClick = (id) => {
  //   history.push(`/update/${id}`);
  // };

  return (
    <>
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
              <h3 className="text-center">Peminjaman</h3>
              <Button
                className="btn btn-primary mb-2"
                onClick={() => navigate(ADD_BORROW)}
              >
                Tambah
              </Button>
              <div className="w-full mw-full">
                <div className="card p-0 bg-very-dark-dm">
                  <div className="table-responsive">
                    <table className="table table-inner-bordered">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Created at</th>
                          <th>Admin</th>
                          <th>User</th>
                          <th>Equipment</th>
                          <th>Status</th>
                          <th>Return Date</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Borrow.map((borrow, index) => {
                          return (
                            <tr key={borrow.id}>
                              <td>{index + 1}</td>
                              <td>
                                {moment(borrow.created_at).format("YYYY-MM-DD")}
                              </td>
                              <td>{borrow.created_by.name}</td>
                              <td>{borrow.user.name}</td>
                              <td>{borrow.equipment.name}</td>
                              <td>
                                {borrow.status === "Peminjaman" ? (
                                  <Badge bg="danger">Peminjaman</Badge>
                                ) : borrow.status === "Pengembalian" ? (
                                  // <span className="badge badge-success">
                                  //   Pengembalian
                                  // </span>
                                  <Badge bg="success">Pengembalian</Badge>
                                ) : (
                                  borrow.status
                                )}
                              </td>
                              <td>{borrow.return_date}</td>
                              {/* <td>
                                <img
                                  src={borrow.image}
                                  alt=""
                                  width="150"
                                  height="150"
                                />
                              </td> */}
                              <td>
                                <div className="row">
                                  <div className="col-1">
                                    <span
                                      style={{ cursor: "pointer" }}
                                      onClick={() => deleteBorrow(borrow.id)}
                                    >
                                      ❌
                                    </span>
                                  </div>
                                  <div className="col-1">
                                    <Link
                                      to={`/edit-borrow/${borrow.id}`}
                                      style={{ textDecoration: "none" }}
                                    >
                                      <span style={{ cursor: "pointer" }}>
                                        ✏️
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </td>
                              {/* <td>{recipe.tags}</td> */}
                              {/* <td>{recipe.ingredients}</td> */}
                              {/* <td key={index}>
                              {recipe.ingredients.map((ingredient) => (
                                <div key={ingredient.id}>
                                  <span>ID: {ingredient.id}</span>
                                  <span>Name: {ingredient.name}</span>
                                </div>
                              ))}
                            </td> */}

                              <td>
                                <div className="row">
                                  {/* <div className="col-10">{data.note}</div> */}
                                  <div className="col-1">
                                    {/* <Link
                                    to={`./${data.id}`}
                                    style={{ cursor: "pointer" }}
                                  >
                                    🔍
                                  </Link> */}
                                  </div>
                                  <div className="col-1">
                                    {/* <span
                                    style={{ cursor: "pointer" }}
                                    onClick={() => deleteContact()}
                                  >
                                    ❌
                                  </span> */}
                                  </div>
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
    </>
  );
};

export default Borrowing;

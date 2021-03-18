import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PaginationCommon from "../../common/pagination";
import Search from "../../common/search";
import Loader from "../../loader";

import { Table } from "reactstrap";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import { fetchOneUser, fetchUserResource } from "../store/action";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

const offsetLimit = 10;
const UserResourceUsage = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState("");
  const [page, setPage] = useState(1);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);

    const user_id = props && props.match.params.id;

    dispatch(
      fetchOneUser(
        `user?id=${user_id}&offset=${offset}&limit=${offsetLimit}&search=${search}`,
        (value) => {
          const { resources, resourcesCount, user } = value.data;
          setUser(user);
          setResources(resources);
          setLoading(false);
          setCount(resourcesCount);
          setOffset(resources.length && resources[resources.length - 1]._id);
        }
      )
    );
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setOffset("");
  };
  const pageChange = (newPage) => {
    const user_id = props && props.match.params.id;
    dispatch(
      fetchOneUser(
        `user?id=${user_id}&offset=${offset}&limit=${offsetLimit}&search=${search}`,
        (value) => {
          console.log("46745785679mncbnmcbm", value);
          const { resources, resourcesCount } = value.data;
          setUser(value.data.user);
          setResources(value.data.resources);
          setLoading(false);
          setCount(resourcesCount);
          setOffset(resources.length && resources[resources.length - 1]._id);
          setPage(newPage);
        }
      )
    );
  };
  return (
    <CRow>
      <CCol lg={12}>
        <form>
          <Search handleSearch={handleSearch} />
          {!loading && resources !== undefined && (
            <div className="calls-with-experts">
              {!loading && <h5>Number of resources used:{count}</h5>}
            </div>
          )}
        </form>
        <CCard className="position-relative">
          {loading && <Loader />}

          <CCardBody>
            <Table
              responsive
              className={`table ${
                resources && resources.length === 0 ? "tableHeight" : ""
              }`}
            >
              {resources && resources.length > 0 && (
                <thead>
                  <tr>
                    <th className="text-nowrap ">Id</th>

                    <th>Name</th>

                    <th>Format</th>
                    <th>Price</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {resources && resources.length === 0 && (
                  <h3 className="text-center no-user-found">
                    No Resources Found!
                  </h3>
                )}

                {resources &&
                  resources.length > 0 &&
                  resources.map((item, index) => {
                    return (
                      <tr
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          history.push({
                            pathname: `/resources/${item._id}`,
                          })
                        }
                      >
                        {/* <td>{item.expert_id}</td>
                        <td>
                          {" "}
                          {item.expert &&
                          item.expert.first_name &&
                          item.expert.last_name
                            ? item.expert.first_name +
                              " " +
                              item.expert.last_name
                            : "-"}
                        </td>

                        <td>{`${item.meeting.date} & ${item.meeting.time}`}</td>
                        <td>
                          {item.appointment_status === "paid"
                            ? "Completed"
                            : "Pending"}
                        </td> */}
                      </tr>
                    );
                  })}
              </tbody>
            </Table>

            <PaginationCommon
              pageChange={pageChange}
              count={count}
              offsetLimit={offsetLimit}
              page={page}
              loading={loading}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

const mapStateToProps = (state) => {
  return {};
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchOneUser,
      fetchUserResource,
    },
    dispatch
  );
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserResourceUsage)
);

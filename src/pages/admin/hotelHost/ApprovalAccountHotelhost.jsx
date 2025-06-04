import React from "react";
import * as Routers from "../../../utils/Routes";
import { useNavigate } from "react-router-dom";
import Sidebar from "../SidebarAdmin";
export default function ApprovalAccountHotelhost() {
  const navigate = useNavigate();
  return (
    <div className="d-flex">
      <div className="col-md-2">
        <Sidebar />
      </div>

      <div className="col-md-10">
        <div className="main-content_1 p-3">
        <h2>Approve request</h2>
        <div className="card table-card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4"></div>
            <div >
              <table className="table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hilton Hotel</td>
                    <td>
                      <button class="btn btn-warning">pendding</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Sofitel Hotel</td>
                    <td>
                      <button class="btn btn-warning">pendding</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Marriott Hotel</td>
                    <td>
                      <button class="btn btn-warning">pendding</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

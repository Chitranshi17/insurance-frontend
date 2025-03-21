import { Button } from '@mui/material';
import React from 'react'

const OtherPolicies = ({ governmentRequestedList, handleGovernmentAcceptance }) => {
    return (
        <>
            {governmentRequestedList?.otherPolicies?.length == 0 ?
                (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <p
                            style={{
                                backgroundColor: "#CCE8EF",
                                paddingInline: "2vw",
                                paddingBlock: "2vh",
                                fontSize: "2.5vh",
                                fontWeight: "bold",
                                border: "2px solid #2EB0D1",
                                borderRadius: "5vh",
                            }}
                        >
                            No Policies
                        </p>
                    </div>
                )
                : (

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontFamily: "Quicksand, sans-serif",
                            marginTop: "20px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: "#f5f5f5",
                                    textAlign: "left",
                                    fontWeight: "900",
                                }}
                            >
                                <th
                                    style={{
                                        padding: "10px",
                                        color: "blue",
                                        textAlign: "center",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Customer ID
                                </th>
                                <th
                                    style={{
                                        padding: "10px",
                                        color: "blue",
                                        textAlign: "center",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Asset
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Insurance Amount
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Status
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Date
                                </th>
                                <th
                                    style={{
                                        textAlign: "center",
                                        color: "blue",
                                        fontSize: "1.5vw",
                                    }}
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {governmentRequestedList?.otherPolicies?.map((item) => {
                                const date = item.createdAt;
                                const formattedDate = new Date(date).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "2-digit",
                                    }
                                );
                                return (
                                    <tr
                                        key={item.policyId}
                                        style={{
                                            borderBottom: "1px solid #E0E0E0",
                                            fontWeight: "800",
                                            fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" }, // Adjusted font size for different screens
                                        }}
                                    >
                                        <td style={{ textAlign: "center", padding: "10px" }}>
                                            {item?.customerId}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px" }}>
                                            {item?.type?.toUpperCase()}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px" }}>
                                            {item?.insuranceAmount}
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px" }}>
                                            <p
                                                style={{
                                                    paddingBlock: "3px",
                                                    paddingInline: "10px",
                                                    borderRadius: "2vh",
                                                    border: `${item?.policyStatus === "active"
                                                        ? "1px solid green"
                                                        : item?.policyStatus === "fulfilled"
                                                            ? "1px solid blue"
                                                            : item?.policyStatus === "rejected"
                                                                ? "1px solid red"
                                                                : item?.policyStatus === "under review"
                                                                    ? "1px solid #E0952B"
                                                                    : "1px solid #9C9C9C"
                                                        }`,
                                                    fontSize: "1.2vh",
                                                    fontWeight: "bold",
                                                    color: `${item?.policyStatus === "active"
                                                        ? "green"
                                                        : item?.policyStatus === "fulfilled"
                                                            ? "blue"
                                                            : item?.policyStatus === "rejected"
                                                                ? "red"
                                                                : item?.policyStatus === "under review"
                                                                    ? "#E0952B"
                                                                    : "#9C9C9C"
                                                        }`,
                                                    width: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                {item?.policyStatus?.toUpperCase()}
                                            </p>
                                        </td>
                                        <td style={{ textAlign: "center", padding: "10px" }}>
                                            {formattedDate}
                                        </td>
                                        <td
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingInline: "1vw",
                                                padding: "10px",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: { xs: "1vh", sm: "1.2vh", md: "1.5vh" },
                                                }}
                                                onClick={() => {
                                                    const payload = {
                                                        id: item?.policyId,
                                                        action: "approve",
                                                    };
                                                    handleGovernmentAcceptance(payload);
                                                }}
                                                disabled={item.policyStatus !== "pending"}
                                            >
                                                Accept Request
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                disabled={item.policyStatus !== "pending"}
                                                sx={{
                                                    fontWeight: "bold",
                                                    fontSize: { xs: "1vh", sm: "1.2vh", md: "1.5vh" },
                                                }}
                                                onClick={() => {
                                                    const payload = {
                                                        id: item?.policyId,
                                                        action: "reject",
                                                    };
                                                    handleGovernmentAcceptance(payload);
                                                }}
                                            >
                                                Reject Request
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )
            }
        </>
    )
}

export default OtherPolicies
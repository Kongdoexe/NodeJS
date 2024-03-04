import mysql from "mysql";
import util from "util";

// export const conn = mysql.createPool({
//   connectionLimit: 10,
//   host: "202.28.34.197",
//   user: "web66_65011212084",
//   password: "65011212084@csmsu",
//   database: "web66_65011212084",
// });

export const conn = mysql.createPool({
  connectionLimit: 10,
  host: "nv1.metrabyte.cloud",
  user: "aemandko_65011212084",
  password: "123456",
  database: "aemandko_65011212084",
});

// export const conn = mysql.createPool({
//   connectionLimit: 10,
//   host: "119.59.96.110",
//   user: "aemandko_Tinchai",
//   password: "Tinchai",
//   database: "aemandko_Tinchai",
// });

export const queryAsync = util.promisify(conn.query).bind(conn);
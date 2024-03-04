import mysql from "mysql";
import express from "express";
// import bcryptt from "bcrypt";
import { UpdateImage, login, register } from "../model/model";
import { conn } from "../dbconnect";

export const router = express.Router();

const saltRounds = 10;

router.get("/Search", (req, res) => {
  let sql , query;
  if(req.query.gmail){
    sql = "SELECT * FROM User where gmail = ?";
    query = req.query.gmail;    
  } else if (req.query.id){
    sql = "SELECT * FROM User where uid = ?"
    query = req.query.id;
  }

  conn.query(sql!,[query], (err, result) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
      throw err;
    }

    res.json(result[0]);
  });
});

router.post("/Register", async (req, res) => {
  try {
    const body: register = req.body;
    const bcrypt = require('bcrypt');

    if (body.password === body.confim) {
      const hashedPassword = await bcrypt.hash(body.password, saltRounds);
      let sql =
        "INSERT INTO `User`(`name`, `gmail`, `password`, `image`, `type`) VALUES (?,?,?,?,?)";
      sql = mysql.format(sql, [
        body.name,
        body.gmail,
        hashedPassword,
        body.image,
        body.type,
      ]);
      conn.query(sql, (err, result) => {
        if (err) throw err;

        res
          .status(201)
          .json(true);
      });
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/Login", async (req, res) => {
  try {
    const body: login = req.body;
    const bcrypt = require('bcrypt');
    let sql = "SELECT * FROM User WHERE gmail = ?";
    conn.query(sql, [body.gmail], async (err, result) => {
      if (err) {
        res.status(500).send({ error: "Internal Server Error" });
        return;
      }

      if (result.length > 0) {
        const passwordMatch = await bcrypt.compare(
          body.password,
          result[0].password
        );

        if (passwordMatch) {
          res.status(200).json(result[0]);
        } else {
          res.status(401).json(false);
        }
      } else {
        res.status(404).json(false);
      }
    });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export interface User {
  uid: number;
  name: string;
  gmail: string;
  password: string;
  image: string;
  type: number;
}

export interface login {
  gmail: string;
  password: string;
}

export interface register {
  name: string;
  gmail: string;
  password: string;
  confim: string;
  image: string;
  type: number;
}

export interface Image {
  mid: number;
  uid: number;
  name: string;
  image: string;
  nameImage: string;
  score: number;
}

export interface UpdateScore {
  mid: number;
  score: number;
}

export interface InsertDatum {
  mid: number;
  score: number;
}

export interface Vote {
  uid : number;
  winner: number;
  loser: number;
}

export interface Inter {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface Graph {
  mid:   number;
  score: number;
  DATE:  Date;
}

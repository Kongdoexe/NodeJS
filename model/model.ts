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

export interface UpdateImage {
  image: string;
}

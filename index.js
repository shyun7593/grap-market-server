const express = require("express");
const cors = require("cors");
const app = express();
const models = require("./models");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
const sequelize = require("sequelize");
const req = require("express/lib/request");
const port = process.env.PORT || 8080;

app.use(express.json()); // JSON형식의 데이터를 처리할 수 있도록 함.
app.use(cors()); // 모든 브라우저에서 내 서버로 요청 가능
app.use("./uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 2,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});
app.get("/products", (req, res) => {
  /* DB에 있는 내용 모두 조회 */
  models.Product.findAll({
    order: [["createdAt", "DESC"]] /* 정렬 할 때 사용 */,
    attributes: [
      "id",
      "name",
      "price",
      "createdAt",
      "seller",
      "imageUrl",
      "soldout",
    ] /* 필요한 컬럼만 선택해서 출력할 때 사용 */,
  })
    .then((result) => {
      console.log("Product : ", result);
      res.send({
        products: result,
      });
    })
    .catch((error) => {
      res.send("에러 발생");
    });
});

app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    name,
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("Product : ", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다.");
    });
});
// 파일 하나를 처리할 때 .single
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

app.post("/purchase/:id", (req, res) => {
  const { id } = req.params;
  models.Product.update(
    {
      soldout: 1,
    },
    {
      where: {
        id,
      },
    }
  )
    .then((result) => {
      res.send({
        result: true,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생했습니다.");
    });
});

//요청을 대기하고 완료되면 함수 실행
app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync()
    .then(() => {
      console.log("DB 연결 성공");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});

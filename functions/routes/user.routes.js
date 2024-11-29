// eslint-disable-next-line new-cap
const {Router} = require("express");
// eslint-disable-next-line new-cap
const router = Router();


const {db} = require("../firebase-config");


// Agregar nuevo usuario

router.post("/api/new-user", async (req, res) => {
  try {
    await db.collection("user").doc("/" + req.body.id + "/").create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

    return res.json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

// mostrar usuarios

router.get("/api/user", async (req, res) => {
  try {
    const query = db.collection("user");
    const querySnapshot = await query.get();
    const docs = querySnapshot.docs;

    const response = docs.map((doc) =>({
      id: doc.id,
      name: doc.data().name,
      email: doc.data().email,
      password: doc.data().password,
    }));
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error);
  }
});


// ingresar usuario por login simple

router.post("/api/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const usersRef = db.collection("user");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    let userData = null;
    snapshot.forEach((doc) => {
      userData = doc.data();
    });

    if (userData.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        email: userData.email,
        name: userData.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Eliminar usuario

router.delete("/api/delete-user/:user_id", async (req, res)=> {
  try {
    const document = db.collection("user").doc(req.params.user_id);
    document.delete();
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Editar usuario

router.put("/api/user/:user_id", async (req, res)=> {
  try {
    const document = db.collection("user").doc(req.params.user_id);
    document.update({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    return res.status(200).json();
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;

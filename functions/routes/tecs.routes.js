
const {Router} = require('express')
const router = Router();

const admin = require('firebase-admin');

const {db} = require('../firebase-config');

//---------------------------------------Rutas de Tecnologicos -----------------
//Tecnologicos id, nombre, ciudad, municipio, carreras (arreglo)


//Agregar uno nuevo
router.post('/api/nuevo-tec', async (req, res) => {
    try{
        await db.collection('tecs').doc('/' + req.body.id + '/').create(
            {name: req.body.name, 
            city: req.body.city, 
            town: req.body.town,
            degree: req.body.degree
        });

        return res.json();
    }catch(error){
        return res.status(500).send(error);
    }
});


//Lista de Tecnologicos
router.get('/api/tecs', async (req,res)=>{
    try {
        const query = db.collection('tecs');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) =>({
            id: doc.id,
            name: doc.data().name,
            city: doc.data().city,
            town: doc.data().town,
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});





//editar tecnologico
router.put('/api/tecs/:tec_id', async (req, res)=>{
    try {
       const document = db.collection('tecs').doc(req.params.tec_id);
        document.update({
            name: req.body.name,
            town: req.body.town,
            city: req.body.city,
        });
        return req.status(200).json();
    } catch (error) {
        return res.status(500).send(error);
    }
});


//Borrar tecnologico
router.delete('/api/delete-tecs/:tec_id', async(req, res)=>{
    try {
        const document = db.collection('tecs').doc(req.params.tec_id);
        document.delete();
        return res.status(200).json();
    } catch (error) {
        return res.status(500).send(error);
    }
});



//Agregar carrera a tec
// router.put('/api/tecs-nueva-carrera/:tecs_id', async(req, res)=>{
//     try {
//         const doc = db.collection('tecs').doc(req.params.product_id);


//         const item = await doc.get();
//         const response = item.data().degree;


//         const 
//         return res.status(200).json(response);
//     } catch (error) {
//         return res.status(500).send(error);
//     }
// });


module.exports = router;
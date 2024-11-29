
const {Router} = require('express')
const router = Router();

const admin = require('firebase-admin');
const {db} = require('../firebase-config');


//Abr consultar ganador (muestra todos)
router.get('/api/winners', async (req,res)=>{
    try {
        const query = db.collection('winner');
        const querySnapshot = await query.get();
        const docs = querySnapshot.docs;

        const response = docs.map((doc) =>({
            id: doc.id,
            name: doc.data().proyect,
            description: doc.data().description,
            event: doc.data().event,
            integrants:doc.get().integrants,
        }));

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).send(error);
    }
});


//Abr consulta ganador (muestra 1)  ESTE ES EL QUE JALA
router.get('/api/winner', async (req, res) => {
    try {
        const consult = db.collection('winner');

        // Ordena por 'event' en orden descendente y toma el documento más reciente
        const snapshot = await consult.orderBy('event', 'desc').limit(1).get();

        // Verifica si la consulta devolvió documentos
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No winners found.' });
        }

        // Extrae el documento más reciente
        const latestWinner = snapshot.docs.map((doc) => ({
            id: doc.id,
            description: doc.data().description,
            event: doc.data().event.toDate(), // Convierte el Timestamp a una fecha
            integrants: doc.data().integrants,
            name: doc.data().name,
        }))[0]; // Obtén el primer documento

        return res.status(200).json(latestWinner);
    } catch (error) {
        console.error('Error fetching winner:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;




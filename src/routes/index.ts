import express from 'express';
const router = express.Router();
import mondayRoutes from './monday';
import fragranceRoutes from "./fragrances";
import orderRoutes from "./orders";

router.use("/monday", mondayRoutes);

router.use("/fragrances", fragranceRoutes);
router.use("/orders", orderRoutes);

// serve client app
router.use(express.static('client/build'));

router.get('/health', function(req, res) {
  res.json(getHealth());
  res.end();
});

router.get('/view', function(req, res) {
    res.sendFile('index.html', { root: 'client/build/' });
});

function getHealth() {
  return {
    ok: true,
    message: 'Healthy'
  };
}

export default router;

import {Router} from 'express';
const router = Router();

import * as transformationController from '../controllers/monday-controller';
import authenticationMiddleware from '../middlewares/authentication';

router.post('/execute_action', authenticationMiddleware, transformationController.executeAction);
router.post('/reverse_string', authenticationMiddleware, transformationController.reverseString);

export default router;

import { AdminLogin } from '@/controllers/auth.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

router.post('/login', AdminLogin);

export default router;

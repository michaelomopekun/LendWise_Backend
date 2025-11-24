import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { LoanController } from '../controller/loanController';
import { CustomerController } from '../controller/customerController';
import { authMiddleware } from '../middleware/auth';


const router = Router();

const protectedRouter = Router();
protectedRouter.use(authMiddleware);

const authController = new AuthController();
const loanController = new LoanController();
const customerController = new CustomerController();


// Authentication routes
router.post('/auth/register', authController.Register.bind(authController));
router.post('/auth/login', authController.Login.bind(authController));
router.post('/auth/officer-login', authController.OfficerLogin.bind(authController));

// loan routes
protectedRouter.get('/loans/summary', loanController.LoanSummary.bind(loanController));
protectedRouter.get('/loans/active', loanController.GetActiveLoans.bind(loanController));
protectedRouter.post('/loans/repay', loanController.RepayLoan.bind(loanController));

protectedRouter.get('/loans/:id/repayment_history', loanController.GetLoanRepaymentHistory.bind(loanController));
protectedRouter.get('/loans/:id', loanController.GetLoanDetails.bind(loanController));
protectedRouter.get('/loans', loanController.GetAllLoans.bind(loanController));
protectedRouter.post('/loans', loanController.RequestLoan.bind(loanController));

// customer routes
protectedRouter.get('/customers/profile', customerController.GetCustomerProfile.bind(customerController));

router.use(protectedRouter);

export default router;
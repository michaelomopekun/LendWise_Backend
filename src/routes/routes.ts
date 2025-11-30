import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { LoanController } from '../controller/loanController';
import { CustomerController } from '../controller/customerController';
import { authMiddleware, bankAuthMiddleware } from '../middleware/auth';
import { BankController } from '../controller/BankController';
import { LoanTypeController } from '../controller/loanTypeController';


const router = Router();
const customerProtectedRouter = Router();
const bankProtectedRouter = Router();

customerProtectedRouter.use(authMiddleware);
bankProtectedRouter.use(bankAuthMiddleware)

const authController = new AuthController();
const loanController = new LoanController();
const customerController = new CustomerController();
const bankController = new BankController();
const loanTypeController = new LoanTypeController();

// Authentication routes
router.post('/auth/register', authController.Register.bind(authController));
router.post('/auth/login', authController.Login.bind(authController));
router.post('/auth/bankLogin', authController.BankLogin.bind(authController));
router.post('/auth/bankRegister', authController.RegisterBank.bind(authController));


// loan type customer route
customerProtectedRouter.get('/loans/types', loanTypeController.GetLoanTypesByBankId.bind(loanTypeController));


// loan type bank routes
bankProtectedRouter.post('/loans/types', loanTypeController.CreateLoanType.bind(loanTypeController));


// loan customer routes
customerProtectedRouter.get('/loans/summary', loanController.LoanSummary.bind(loanController));
customerProtectedRouter.get('/loans/active', loanController.GetActiveLoans.bind(loanController));
customerProtectedRouter.post('/loans/repay', loanController.RepayLoan.bind(loanController));


customerProtectedRouter.get('/loans/:id/repayment_history', loanController.GetLoanRepaymentHistory.bind(loanController));
customerProtectedRouter.get('/loans/:id', loanController.GetLoanDetails.bind(loanController));
customerProtectedRouter.get('/loans', loanController.GetAllLoans.bind(loanController));
customerProtectedRouter.post('/loans', loanController.RequestLoan.bind(loanController));


// customer routes
customerProtectedRouter.get('/customers/profile', customerController.GetCustomerProfile.bind(customerController));


//bank routes
router.get('/banks', bankController.GetAllBanks.bind(bankController));

router.use(customerProtectedRouter);
router.use(bankProtectedRouter);

export default router;
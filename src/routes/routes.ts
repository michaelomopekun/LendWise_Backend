import { Router } from 'express';
import { AuthController } from '../controller/authController';
import { LoanController } from '../controller/loanController';
import { CustomerController } from '../controller/customerController';
import { authMiddleware, bankAuthMiddleware } from '../middleware/auth';
import { BankController } from '../controller/BankController';
import { LoanTypeController } from '../controller/loanTypeController';
import { WalletController } from '../controller/walletContoller';

const router = Router();
const customerProtectedRouter = Router();
const bankProtectedRouter = Router();
const protectedRouter = Router();

// Apply middleware ONLY to specific routers
customerProtectedRouter.use(authMiddleware);
protectedRouter.use(authMiddleware);
bankProtectedRouter.use(bankAuthMiddleware);

const authController = new AuthController();
const loanController = new LoanController();
const customerController = new CustomerController();
const bankController = new BankController();
const loanTypeController = new LoanTypeController();
const walletController = new WalletController();

// ============ PUBLIC ROUTES (No middleware) ============
// auth
router.post('/auth/register', authController.Register.bind(authController));
router.post('/auth/login', authController.Login.bind(authController));
router.post('/auth/bank/login', authController.BankLogin.bind(authController));
router.post('/auth/bank/register', authController.RegisterBank.bind(authController));

// bank
router.get('/banks', bankController.GetAllBanks.bind(bankController));




// ============ CUSTOMER PROTECTED ROUTES (authMiddleware) ============

//wallet
customerProtectedRouter.get('/wallet', walletController.GetWallet.bind(walletController));
customerProtectedRouter.get('/wallet/transactions', walletController.GetWalletTransactions.bind(walletController));
customerProtectedRouter.post('/wallet/fund', walletController.AddFundToWallet.bind(walletController));
customerProtectedRouter.post('/wallet/withdraw', walletController.WithdrawFundFromWallet.bind(walletController));

//loan types
customerProtectedRouter.get('/loans/types', loanTypeController.GetLoanTypesByBankId.bind(loanTypeController));

// loans
customerProtectedRouter.get('/loans/summary', loanController.LoanSummary.bind(loanController));
customerProtectedRouter.get('/loans/active', loanController.GetActiveLoans.bind(loanController));
customerProtectedRouter.post('/loans/repay', loanController.RepayLoan.bind(loanController));
customerProtectedRouter.get('/loans/:id/repayment_history', loanController.GetLoanRepaymentHistory.bind(loanController));
customerProtectedRouter.get('/loans/:id/customerId/:customerId', loanController.GetLoanDetails.bind(loanController));
customerProtectedRouter.get('/loans', loanController.GetAllLoans.bind(loanController));
customerProtectedRouter.post('/loans', loanController.RequestLoan.bind(loanController));

//customer
customerProtectedRouter.get('/customers/profile/:customerId', customerController.GetCustomerProfile.bind(customerController));





// ============ BANK PROTECTED ROUTES (bankAuthMiddleware) ============

//bank
bankProtectedRouter.post('/loans/types', loanTypeController.CreateLoanType.bind(loanTypeController));
bankProtectedRouter.get('/banks/metrics', bankController.FetchKeyMetrics.bind(bankController));
bankProtectedRouter.get('/banks/loans/pending', loanController.GetBanksPendingLoan.bind(loanController));
bankProtectedRouter.put('/banks/loans/:id/approve', loanController.ApproveLoan.bind(loanController));
bankProtectedRouter.put('/banks/loans/:id/reject', loanController.RejectLoan.bind(loanController));




router.use(customerProtectedRouter);
router.use(protectedRouter);
router.use(bankProtectedRouter);

export default router;
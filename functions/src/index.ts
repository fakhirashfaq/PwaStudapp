/** 
 * index.ts deals with export
 * 
 */


// main must be before any functions
export * from './main';

// export { pushToAlgolia } from './pushToAlgolia';
export { discountsOnDelete } from './discountsOnDelete';
// export { discountsOnUpdate } from './discountsOnUpdate';
// export { sendCollectionToAlgolia } from './sendCollectionToAlgolia';
export { sendVerifyInsMail } from './sendVerifyInsMail';
export { validateUserAcc } from './validateUserAcc';
export { validateVcode } from './validateVcode';
export { authUserOnDelete } from './authUserOnDelete';
export { userOnDelete } from './userOnDelete';
export { authUserOnCreate } from './authUserOnCreate';
export { sendSubscribeNewsletterMail } from './sendSubscribeNewsletterMail';
export { unsubscribeNewsletter } from './unsubscribeNewsletter';
export { manualVerificationMail } from './manualVerificationMail';
export { deleteUserAcc } from './deleteUserAcc';
export { scheduledFuncDiscountCleanup } from './scheduledFuncDiscountCleanup';


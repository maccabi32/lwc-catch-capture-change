import getAllAccounts from '@salesforce/apex/LTN_GetAllAccounts.getAllAccounts';
import { LightningElement, wire } from 'lwc';

export default class AllAccounts extends LightningElement {
    @wire(getAllAccounts)
    accounts;
}
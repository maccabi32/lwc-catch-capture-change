import { LightningElement, wire, api } from 'lwc';
import { getRecord, getFieldValue, getFieldDisplayValue } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class TestChangeCaptureChange extends LightningElement {
    channelName = '/data/AccountChangeEvent';
    isSubscribeDisabled = false;
    isUnsubscribeDisabled = !this.isSubscribeDisabled;
    subscription;
    @api recordId;

    @wire(getRecord, {recordId:'$recordId', layoutTypes:"Full"})
    account;

    get name(){
        return getFieldValue(this.account.data, 'Account.Name');
    }

    get type(){
        return getFieldDisplayValue(this.account.data, 'Account.Type');
    }

    // Initializes the component
    connectedCallback() {       
        // Register error listener       
        this.registerErrorListener();
        if(!this.subscription)
            this.handleSubscribe();      
    }

    // Handles subscribe button click
    handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const that = this;
        const messageCallback = function(response) {
            console.log('New message received: ', JSON.stringify(response));
            // Response contains the payload of the new message received
            console.log('AccountId: '+that.recordId);
            console.log('change accounts: '+JSON.stringify(response.data.payload.ChangeEventHeader.recordIds));
            if(response.data.payload.ChangeEventHeader.recordIds.includes(that.recordId)){
                console.log('REFRESH');
                return refreshApex(that.account);
            }
        };

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }

    // Handles unsubscribe button click
    handleUnsubscribe() {
        this.toggleSubscribeButton(false);

        // Invoke unsubscribe method of empApi
        unsubscribe(this.subscription, response => {
            console.log('unsubscribe() response: ', JSON.stringify(response));

            // Response is true for successful unsubscribe
        });
    }


    registerErrorListener() {
        // Invoke onError empApi method
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}
public with sharing class LTN_GetAllAccounts {
    @AuraEnabled(cacheable=true)
    public static List<Id> getAllAccounts(){
        try {
            List<Id> ret = new List<Id>();
            for(Account account: [Select Id FROM Account Limit 10]){
                ret.add(account.Id);
            }
            return ret;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}

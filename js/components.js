 class AlertDialog {
     constructor(title, message) {
         this.message = message;
         this.title = title;
     }
     static dismiss() {
         document.querySelector('#alert_view').style.visibility = 'collapse';
         document.querySelector('#alert_view').innerHTML = "";
     }
 }

 AlertDialog.prototype.show = function () {
     var html = '<div class="alert-dialog-mask" style="z-index: 50001;"></div>' +
         '<div class="alert-dialog" style="z-index: 50002;">' +
         '<div class="alert-dialog-container" style="z-index: 50003;">' +
         '<div class="alert-dialog-title">' + this.title + '</div>' +
         '<div class="alert-dialog-content">' + this.message + '</div>' +
         '<div class="alert-dialog-footer">' +
         ' <button class="alert-dialog-button alert-dialog-button--primal" onclick="AlertDialog.dismiss();">OK</button>' +
         '</div>' +
         ' </div>' +
         '</div>';
     setViewById('#alert_view', html);
 }

 class Toast {
     static show(message, action, length) {
         var html = '<div class="toast" id="toast_2018">' +
             '<div class="toast__message">' + message + '</div>';

         if (action != undefined || action != null) {
             Toast.Action = action;
             html += '<button class="toast__button" onclick="Toast.executeAction();">' + action.message + '</button>';
         }

         html += '</div>';

         setViewById('#toast_view', html);
         Toast.dismiss(length);
     }

     static dismiss(length) {
         setTimeout(function () {
             clearView('#toast_2018');
             clearViewParentDelay('#toast_view', 0.5);
         }, length);
     }

     static executeAction() {
         if (Toast.Action != undefined) {
             Toast.Action.action();
             clearViewParentDelay('#toast_view', 0);
         }
     }
 }

 Toast.Length = {
     SHORT: 1000,
     MEDIUM: 2000,
     LARGE: 3000
 }

 class ProgressDialog {
     constructor(option) {
         this.title = option.title;
         this.message = option.message;
         this.cancelable = option.cancelable;
     }
     static dismiss() {
         clearViewParentDelay('#progress_view', 0);
     }
 }

 ProgressDialog.prototype.show = function () {
     var typeMask = '<div class="alert-dialog-mask"></div>';
     if (this.cancelable) {
         typeMask = '<div class="alert-dialog-mask"  onclick="ProgressDialog.dismiss();"></div>';
     }
     var dialog = '<div id="progress_dialog">' +
         typeMask +
         '<div class="alert-dialog">' +
         '<div class="progress-dialog-container">' +
         '<div class="alert-dialog-content">' +
         '<svg class="progress-circular progress-circular--indeterminate float-left">' +
         '<circle class="progress-circular__background"/>' +
         '<circle class="progress-circular__primary progress-circular--indeterminate__primary"/>' +
         '<circle class="progress-circular__secondary progress-circular--indeterminate__secondary"/>' +
         '</svg>' +
         '<p class="progress-message-p">' + this.message + '</p>' +
         // '<button onclick="dismissDialog();" class="alert-dialog-button alert-dialog-button--primal">OK</button>'+
         '</div>' +
         '</div>' +
         '</div>' +
         '</div>';

     setViewById('#progress_view', dialog);
 }

 ProgressDialog.prototype.dissmis = function () {
     document.querySelector('#progress_view').style.visibility = 'collapse';
     document.querySelector('#progress_view').innerHTML = "";
 }

 function clearView(id) {
     var dom = document.querySelector(id);
     if (dom != null) {
         dom.style.opacity = '0';
         dom.style.transition = 'opacity 0.5s linear'
         setTimeout(function () {
             var dom = document.querySelector(id);
             if (dom) {
                 dom.innerHTML = "";
                 dom.style.visibility = 'collapse';
             }
         }, 500);
     }
 }

 function clearViewParentDelay(id, seconds) {
     setTimeout(function () {
         var dom = document.querySelector(id);
         if (dom) {
             dom.innerHTML = "";
             dom.style.visibility = 'collapse';
         }
     }, seconds * 1000);
 }

 function setViewById(id, html) {
     var dom = document.querySelector(id);
     dom.innerHTML = "";
     dom.style.visibility = 'visible';
     dom.innerHTML = html;

 }

 class TextDialog {

     constructor(title, message, placeholder) {
         this.title = title;
         this.message = message;
         this.placeholder = placeholder;
         this.result = '';
         this._okcallback = null;
     }

     getTemplate() {
         var html = ' <div class="alert-dialog-mask" style="z-index: 50001"></div>' +
             '<div id="textdialog_2018" class="alert-dialog" style="z-index: 50002">' +
             '<div class="alert-dialog-container">' +
             '<div class="alert-dialog-title">' +
             this.title +
             '</div>' +
             '<div class="alert-dialog-content">' +
             this.message +
             '</div>' +
             '<div class="alert-dialog-textarea">' +
             ' <textarea  class="textarea dialog-textarea" rows="1" ' +
             ' placeholder="' + this.placeholder + '">' +
             '</textarea>' +
             '</div>' +
             '<div class="alert-dialog-footer alert-dialog-footer--rowfooter">' +
             ' <button class="alert-dialog-button alert-dialog-button--rowfooter" onclick="TextDialog.dismiss();">Cancelar</button>' +
             '<button class="alert-dialog-button alert-dialog-button--primal alert-dialog-button--rowfooter" onclick="TextDialog.execute();">Aceptar</button>' +
             '</div>' +
             ' </div>' +
             '</div>';
         return html;
     }

     show(callbackResult) {
         TextDialog.callbackResult = callbackResult;
         setViewById('#progress_view', this.getTemplate());
     }

     static execute() {
         var textarea = document.querySelector('.dialog-textarea');
         TextDialog.callbackResult(textarea.value);
         TextDialog.dismiss();
     }

     static dismiss() {
         setTimeout(function () {
             clearView('#textdialog_2018');
             clearViewParentDelay('#progress_view', 0.5);
         }, length);

     }

 };

 TextDialog.callbackResult = null;

 class ActionSheet {

     constructor(title, sheetPrimary, sheetCancel) {
         this.title = title;
         this.sheetPrimary = sheetPrimary;
         this.sheetCancel = sheetCancel;
     }
     getTemplate() {
         var html = '<div class="action-sheet-mask" style="z-index: 60001"></div>' +
             '<div class="action-sheet" style="z-index: 60002">' +
             '<div class="action-sheet-title">' + this.title + '</div>'+
         '<button class="action-sheet-button action-sheet-button--destructive" onclick="ActionSheet.execute();">' + this.sheetPrimary + '</button>' +
             '<button class="action-sheet-button" onclick="ActionSheet.dismiss();" >' + this.sheetCancel + '</button>' +
             '</div>';
         
         return html;

     }
     show(callbackResult) {
         ActionSheet.callbackResult = callbackResult;
         setViewById('#action_sheet_view', this.getTemplate());
     }
     static dismiss() {
         clearViewParentDelay('#action_sheet_view', 0);
     }
     static execute(){
         ActionSheet.callbackResult();
         ActionSheet.dismiss();
     }
 }

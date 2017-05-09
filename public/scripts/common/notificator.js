const DEFAULT_TIMEOUT = 3000;

class Notificator {
    success(message, heading = '', timeOut = DEFAULT_TIMEOUT) {
        toastr.success(message, heading, { timeOut });
    }

    error(message, heading = '', timeOut = DEFAULT_TIMEOUT) {
        toastr.error(message, heading, { timeOut });
    }

    warning(message, heading = '', timeOut = DEFAULT_TIMEOUT) {
        toastr.warning(message, heading, { timeOut });
    }

    sweetAlert(title, imageUrl, userResponseCallback) {
        swal({
                title: title,
                imageUrl: imageUrl,
                showCancelButton: true,
                confirmButtonClass: "btn-success",
                cancleButtonClass: "btn-default",
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            userResponseCallback
        );
    }
}

const notificator = new Notificator();

export { notificator };
import Repository from "./Repository";
function RepoDialogBox() {
    return (
        <>
            <button
                type="button"
                className="repo-trigger-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                <i className="bi bi-folder2-open"></i>
                <span>Repositories</span>
                <i className="bi bi-search"></i>
            </button>

            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg repo-modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                <i className="bi bi-github me-2"></i>
                                Latest 2 Years Repositories
                            </h1>

                            <button
                                type="button"
                                className="repo-modal-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        <div className="modal-body">
                            <Repository />
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                data-bs-dismiss="modal"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RepoDialogBox;
import Repository from "./Repository";

function RepoDialogBox() {
  return (
	<> 
<button style={{marginLeft:"4rem",fontSize:"1rem",border:"1px solid #8c8c8c"}}
type="button" 
className="btn btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
  search repo <i className="bi bi-search"></i>
</button> 
<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Latest 2 years repositories..</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <Repository/>
      </div>
      <div class="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
	</>
  )
}

export default RepoDialogBox;
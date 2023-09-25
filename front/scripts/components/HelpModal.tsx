export default ({ open, onClose }) => {
  return (
    <div>
      <div
        className={`modal modal-xl fade ${open ? "show" : ""}`}
        id="helpModal"
        tabIndex="-1"
        style={{ display: open ? "block" : "none" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Où coller le lien de mon agenda ?</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <p>Il faut chercher dans votre agenda favori la fonctionnalité "Ajouter à partir d'une URL".</p>
              <p>Par exemple sur Google dans les préférences :</p>
              <img src={require("../../assets/img/import-calendar-preferences.jpg")} />
              <p>ou sur l'écran principal :</p>
              <img src={require("../../assets/img/import-calendar.jpg")} />
              <hr />
              <p>NB: Cette section s'améliorera avec vos retours.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${open ? "show" : ""}`}
        onClick={onClose}
        style={{ display: open ? "block" : "none" }}
      ></div>
    </div>
  );
};

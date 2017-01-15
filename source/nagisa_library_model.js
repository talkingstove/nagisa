/****
* Library to which reference classes are added
*******/
window.N = window.N || {};
Nagisa = N;
N.Library.referenceLibrary = [];

N.Library.lookUpReferenceById = function(id) {
	for (var i=0; i<N.Library.referenceLibrary.length; i++) {
		if (N.Library.referenceLibrary[i].id == id) {
			return N.Library.referenceLibrary[i];
		}
	}

	//console.warn("Reference not found for id", id);
	return null;
}

N.Library.listAllReferences = function() {
	
}

N.Library.createReference = function(id, classReference, description, debug) {
	if (N.Library.lookUpReferenceById(id) != null) {
		console.warn('Library object with id ' + id + ' already exists!');
		return false;
	}

	var description = description || 'No description provided for this class.';
	//id required; push it into the class itself to make sure it has 	it
	classReference.id = id;
	classReference.description = description;
	N.Library.referenceLibrary.push(classReference);

	if (typeof classReference.init === 'function') {
		classReference.init();
	}
	return true;
}
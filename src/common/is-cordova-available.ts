export let isCordovaAvailable = () => {
	if (!(<any>window).cordova) {
		return false;
	}
	return true;
};

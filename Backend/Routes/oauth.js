const router = require('express').Router();
const authenticator = require('../Middlewares/Authenticator');
const DeezerOAuthController = require('../Controllers/DeezerOauthController');
//const SpotifyOAuthController = require('../Controllers/SpotifyOauthController');

router.get('/deezer/start', authenticator.authenticate, DeezerOAuthController.StartOAuthProcess);
router.get('/deezer/continue', authenticator.authenticate, DeezerOAuthController.ContinueOAuthProcess);

module.exports = router;
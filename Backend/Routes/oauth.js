const router = require('express').Router();
const authenticator = require('../Middlewares/Authenticator');
const DeezerOAuthController = require('../Controllers/DeezerOauthController');
const SpotifyOAuthController = require('../Controllers/SpotifyOauthController');

router.get('/deezer/start', authenticator.authenticate, DeezerOAuthController.StartOAuthProcess);
router.get('/deezer/continue', authenticator.authenticate, DeezerOAuthController.ContinueOAuthProcess);

router.get('/spotify/start', authenticator.authenticate, SpotifyOAuthController.StartOAuthProcess);
router.get('/spotify/continue', authenticator.authenticate, SpotifyOAuthController.ContinueOAuthProcess);
router.get('/spotify/complete', authenticator.authenticate, SpotifyOAuthController.ContinueOAuthProcess);
router.get('/spotify/refresh', authenticator.authenticate, SpotifyOAuthController.ContinueOAuthProcess);

module.exports = router;
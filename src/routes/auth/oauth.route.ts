import { Router } from "express";
import { createGoogleOauthEndpoint, handleGoogleOAuthCallback } from "../../controllers/auth/google-oauth.controller";

const router = Router()

router.route('/google/url').get(createGoogleOauthEndpoint)
router.route('/google/callback').get(handleGoogleOAuthCallback)

export default router;
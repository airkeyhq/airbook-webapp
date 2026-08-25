'use client';

/**
 * AirBook WebAuthn / Passkey & Biometric Helper
 * Supports Apple Touch ID / Face ID, Windows Hello, and Android Biometrics
 */

export async function isPasskeySupported(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!window.PublicKeyCredential) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

function getRandomBuffer(size = 32): Uint8Array {
  const arr = new Uint8Array(size);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(arr);
  }
  return arr;
}

export async function registerStationPasskey(
  userName = 'Station Operator',
  workspaceName = 'AirBook POS'
): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    throw new Error('WebAuthn is not supported on this browser or device.');
  }

  const challenge = getRandomBuffer(32);
  const userId = getRandomBuffer(16);

  const creationOptions: PublicKeyCredentialCreationOptions = {
    challenge: challenge.buffer as ArrayBuffer,
    rp: {
      name: workspaceName,
      id: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    },
    user: {
      id: userId.buffer as ArrayBuffer,
      name: userName,
      displayName: `${userName} (${workspaceName})`,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' }, // ES256
      { alg: -257, type: 'public-key' }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'preferred',
      residentKey: 'preferred',
    },
    timeout: 60000,
    attestation: 'none',
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: creationOptions,
    })) as PublicKeyCredential | null;

    if (credential) {
      // Store local passkey registration indicator
      try {
        localStorage.setItem('airbook_pos_passkey_registered', 'true');
        localStorage.setItem('airbook_pos_passkey_id', credential.id);
      } catch (e) {
        console.warn('LocalStorage write failed:', e);
      }
      return true;
    }
    return false;
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      console.info('Passkey registration was cancelled by the user.');
      return false;
    }
    console.error('Passkey creation error:', err);
    throw err;
  }
}

export async function authenticateStationPasskey(): Promise<boolean> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return false;
  }

  const challenge = getRandomBuffer(32);

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge.buffer as ArrayBuffer,
    rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    userVerification: 'preferred',
    timeout: 60000,
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: requestOptions,
    });
    return !!assertion;
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      console.info('Passkey biometric prompt dismissed by user.');
      return false;
    }
    console.warn('Passkey authentication skipped or failed:', err);
    return false;
  }
}

export async function signInWithPasskey(email?: string): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return { success: false, error: 'WebAuthn passkeys are not supported on this browser.' };
  }

  const supported = await isPasskeySupported();
  if (!supported) {
    return { success: false, error: 'No biometric authenticator (Touch ID / Face ID / Windows Hello) available.' };
  }

  const challenge = getRandomBuffer(32);

  const requestOptions: PublicKeyCredentialRequestOptions = {
    challenge: challenge.buffer as ArrayBuffer,
    rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname,
    userVerification: 'preferred',
    timeout: 60000,
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: requestOptions,
    });

    if (!assertion) {
      return { success: false, error: 'Passkey verification failed.' };
    }

    // Call server to establish authenticated session
    const res = await fetch('/api/auth/passkey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentialId: assertion.id,
        email: email || undefined,
      }),
    });

    const data = await res.json();
    if (data.success) {
      return { success: true };
    }

    return { success: false, error: data.error || 'Could not verify session with passkey.' };
  } catch (err: any) {
    if (err.name === 'NotAllowedError') {
      return { success: false, error: 'Passkey verification was cancelled.' };
    }
    return { success: false, error: err.message || 'Passkey verification error.' };
  }
}


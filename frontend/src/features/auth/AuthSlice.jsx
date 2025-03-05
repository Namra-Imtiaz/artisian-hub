import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup } from './AuthApi';

const initialState = {
    status: "idle",
    errors: null,
    signupStatus: "idle",
    signupError: null,
    loginStatus: "idle",
    loginError: null,
    loggedInUser: null,
    forgotPasswordStatus: "idle",
    forgotPasswordSuccessMessage: null,
    forgotPasswordError: null,
    resetPasswordStatus: "idle",
    resetPasswordSuccessMessage: null,
    resetPasswordError: null,
    successMessage: null,
    isAuthChecked: false,
};

export const signupAsync = createAsyncThunk('auth/signupAsync', async (cred) => {
    const res = await signup(cred);
    return res;
});

export const loginAsync = createAsyncThunk('auth/loginAsync', async (cred) => {
    const res = await login(cred);
    return res;
});

export const forgotPasswordAsync = createAsyncThunk('auth/forgotPasswordAsync', async (cred) => {
    const res = await forgotPassword(cred);
    return res;
});

export const resetPasswordAsync = createAsyncThunk('auth/resetPasswordAsync', async (cred) => {
    const res = await resetPassword(cred);
    return res;
});

export const checkAuthAsync = createAsyncThunk('auth/checkAuthAsync', async () => {
    const res = await checkAuth();
    return res;
});

export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => {
    const res = await logout();
    return res;
});

const authSlice = createSlice({
    name: "authSlice",
    initialState: initialState,
    reducers: {
        clearAuthSuccessMessage: (state) => {
            state.successMessage = null;
        },
        clearAuthErrors: (state) => {
            state.errors = null;
        },
        resetAuthStatus: (state) => {
            state.status = 'idle';
        },
        resetSignupStatus: (state) => {
            state.signupStatus = 'idle';
        },
        clearSignupError: (state) => {
            state.signupError = null;
        },
        resetLoginStatus: (state) => {
            state.loginStatus = 'idle';
        },
        clearLoginError: (state) => {
            state.loginError = null;
        },
        resetForgotPasswordStatus: (state) => {
            state.forgotPasswordStatus = 'idle';
        },
        clearForgotPasswordSuccessMessage: (state) => {
            state.forgotPasswordSuccessMessage = null;
        },
        clearForgotPasswordError: (state) => {
            state.forgotPasswordError = null;
        },
        resetResetPasswordStatus: (state) => {
            state.resetPasswordStatus = 'idle';
        },
        clearResetPasswordSuccessMessage: (state) => {
            state.resetPasswordSuccessMessage = null;
        },
        clearResetPasswordError: (state) => {
            state.resetPasswordError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupAsync.pending, (state) => {
                state.signupStatus = 'pending';
            })
            .addCase(signupAsync.fulfilled, (state, action) => {
                state.signupStatus = 'fulfilled';
                state.loggedInUser = action.payload;
            })
            .addCase(signupAsync.rejected, (state, action) => {
                state.signupStatus = 'rejected';
                state.signupError = action.error;
            })

            .addCase(loginAsync.pending, (state) => {
                state.loginStatus = 'pending';
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loginStatus = 'fulfilled';
                state.loggedInUser = action.payload;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loginStatus = 'rejected';
                state.loginError = action.error;
            })

            .addCase(forgotPasswordAsync.pending, (state) => {
                state.forgotPasswordStatus = 'pending';
            })
            .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
                state.forgotPasswordStatus = 'fulfilled';
                state.forgotPasswordSuccessMessage = action.payload;
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                state.forgotPasswordStatus = 'rejected';
                state.forgotPasswordError = action.error;
            })

            .addCase(resetPasswordAsync.pending, (state) => {
                state.resetPasswordStatus = 'pending';
            })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                state.resetPasswordStatus = 'fulfilled';
                state.resetPasswordSuccessMessage = action.payload;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.resetPasswordStatus = 'rejected';
                state.resetPasswordError = action.error;
            })

            .addCase(logoutAsync.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.status = 'fulfilled';
                state.loggedInUser = null;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error;
            })

            .addCase(checkAuthAsync.pending, (state) => {
                state.status = 'pending';
            })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                state.loggedInUser = action.payload;
                state.isAuthChecked = true;
            })
            .addCase(checkAuthAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error;
                state.isAuthChecked = true;
            });
    }
});

// exporting selectors
export const selectAuthStatus = (state) => state.AuthSlice.status;
export const selectAuthErrors = (state) => state.AuthSlice.errors;
export const selectLoggedInUser = (state) => state.AuthSlice.loggedInUser;
export const selectAuthSuccessMessage = (state) => state.AuthSlice.successMessage;
export const selectIsAuthChecked = (state) => state.AuthSlice.isAuthChecked;
export const selectSignupStatus = (state) => state.AuthSlice.signupStatus;
export const selectSignupError = (state) => state.AuthSlice.signupError;
export const selectLoginStatus = (state) => state.AuthSlice.loginStatus;
export const selectLoginError = (state) => state.AuthSlice.loginError;
export const selectForgotPasswordStatus = (state) => state.AuthSlice.forgotPasswordStatus;
export const selectForgotPasswordSuccessMessage = (state) => state.AuthSlice.forgotPasswordSuccessMessage;
export const selectForgotPasswordError = (state) => state.AuthSlice.forgotPasswordError;
export const selectResetPasswordStatus = (state) => state.AuthSlice.resetPasswordStatus;
export const selectResetPasswordSuccessMessage = (state) => state.AuthSlice.resetPasswordSuccessMessage;
export const selectResetPasswordError = (state) => state.AuthSlice.resetPasswordError;

// exporting reducers
export const {
    clearAuthSuccessMessage,
    clearAuthErrors,
    resetAuthStatus,
    clearSignupError,
    resetSignupStatus,
    clearLoginError,
    resetLoginStatus,
    clearForgotPasswordError,
    clearForgotPasswordSuccessMessage,
    resetForgotPasswordStatus,
    clearResetPasswordError,
    clearResetPasswordSuccessMessage,
    resetResetPasswordStatus,
} = authSlice.actions;

export default authSlice.reducer;

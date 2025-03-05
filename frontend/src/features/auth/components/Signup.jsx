import {
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
} from '@mui/material';
import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { ecommerceOutlookAnimation } from '../../../assets';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import {
  selectLoggedInUser,
  signupAsync,
  selectSignupStatus,
  selectSignupError,
  clearSignupError,
  resetSignupStatus
} from '../AuthSlice';
import { toast } from 'react-toastify';
import { MotionConfig, motion } from 'framer-motion';

export const Signup = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectSignupStatus);
  const error = useSelector(selectSignupError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  // watches password field for confirm password validation
  const watchPassword = watch("password");

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === 'fullfilled') {
      toast.success("Welcome to ArtisianHub! Your account is ready.");
      reset();
    }
    return () => {
      dispatch(clearSignupError());
      dispatch(resetSignupStatus());
    };
  }, [status]);

  const handleSignup = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(signupAsync(cred));
  };

  return (
    <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{ overflowY: "hidden" }}>

      {!is900 && (
        <Stack bgcolor={'black'} flex={1} justifyContent={'center'}>
          <Lottie animationData={ecommerceOutlookAnimation} />
        </Stack>
      )}

      <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
        <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
          <Stack rowGap={'.4rem'}>
            <Typography
              variant='h2'
              sx={{
                wordBreak: "break-word",
                fontFamily: "Brush Script MT, cursive"
              }}
              fontWeight={600}
            >
              ArtisianHub
            </Typography>
            <Typography alignSelf={'flex-end'} color={'GrayText'} variant='body2'>
              - Shop Your Favourite Crafts
            </Typography>
          </Stack>
        </Stack>

        <Stack
          mt={4}
          spacing={2}
          width={is480 ? "95vw" : '28rem'}
          component={'form'}
          noValidate
          onSubmit={handleSubmit(handleSignup)}
        >
          <MotionConfig whileHover={{ y: -5 }}>
            <motion.div>
              <TextField
                fullWidth
                {...register("name", { required: "Username is required" })}
                placeholder='Username'
              />
              {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                    message: "Enter a valid email"
                  }
                })}
                placeholder='Email'
              />
              {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                fullWidth
                type="password"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
                    message: "At least 8 characters, 1 uppercase, 1 lowercase, and 1 number"
                  }
                })}
                placeholder='Password'
              />
              {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <TextField
                fullWidth
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) => value === watchPassword || "Passwords don't match"
                })}
                placeholder='Confirm Password'
              />
              {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
            </motion.div>

            <motion.div>
              <Select
                fullWidth
                {...register("role", { required: "Role is required" })}
                defaultValue="user"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
              {errors.role && <FormHelperText error>{errors.role.message}</FormHelperText>}
            </motion.div>
          </MotionConfig>

          <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
            <LoadingButton
              sx={{ height: '2.5rem' }}
              fullWidth
              loading={status === 'pending'}
              type='submit'
              variant='contained'
            >
              Signup
            </LoadingButton>
          </motion.div>

          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
              <motion.div>
                <Typography
                  mr={'1.5rem'}
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to={'/forgot-password'}
                  component={Link}
                >
                  Forgot password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to={'/login'}
                  component={Link}
                >
                  Already a member? <span style={{ color: theme.palette.primary.dark }}>Login</span>
                </Typography>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

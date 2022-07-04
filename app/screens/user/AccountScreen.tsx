import { useState, useEffect } from "react"
import HeaderTitle from "~/components/HeaderTitle"
import { useParams, useNavigate } from "@remix-run/react"

import { useSelector, useDispatch } from 'react-redux'
import Avatar from '@mui/material/Avatar'
import { useMutation, useApolloClient } from 'graphql-request'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DialogContentText from '@mui/material/DialogContentText'



import ProgressBar from "~/components/ProgressBar"
import CheckAuth from "~/components/CheckAuth"
import AppStateInterface from "../../interfaces/AppStateInterface"
import { LOG_OUT_MUTATION, UPDATE_USER } from "../../graphql/mutations"
import { LOG_OUT } from "../../redux/actions/user_action_types"
import colors from "../../utils/colors"
import Button from "@mui/material/Button"
import { getFormattedDate, getFile } from "../../utils/helpers"
import TextField from "@mui/material/TextField"
import { IMG_BUCKET, MAX_IMG_FILE_SIZE } from "../../utils/constants.server"
import TextIcon from "~/components/TextIcon"
import UploadButton from "~/components/UploadButton"
import useUpdateUser from "../../hooks/useUpdateUser"
import useFileUpload from "../../hooks/useFileUpload"
import AlertDialog from "~/components/AlertDialog"
import Divider from "~/components/Divider"
import SEO from "~/components/SEO"
import { useForm } from "react-hook-form"
import AppRoutes from "~/app-routes"


// export const styles = {
//   noBgButton: {
//     width: 150,
//     backgroundColor: colors.contentGrey,
//     border: `1px solid ${colors.primary}`
//   },
//   uploadButton: {
//     marginTop: 10,
//     marginBottom: 5,
//   },
//   successColor: { color: colors.success },
//   errorColor: { color: colors.error },
// })

export const NOT_AVAILABLE = `Not Available`

export interface FormData {
  id: string
  name?: string
  email?: string
  telephone?: string
};

export interface UserFormData extends FormData {
  avatar?: string
  img_bucket?: string
}

export default function AccountPage() {
  const params = useParams()
  const navigate = useNavigate()
  const editMode = get(params, 'editMode', false)
  const dispatch = useDispatch()
  const client = useApolloClient()
  const [shouldEdit, setShouldEdit] = useState(editMode)
  const [openInvalidFileSize, setOpenInvalidFileSize] = useState('')
  const currentUser = useSelector(({ currentUser }: AppStateInterface) => currentUser)
  const [logOutMutation] = useMutation(LOG_OUT_MUTATION)
  const userData = get(currentUser, 'data')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: 'onBlur', defaultValues: {
      id: get(userData, 'id'),
      name: get(userData, 'name'),
      email: get(userData, 'email'),
      telephone: get(userData, 'telephone')
    }
  })
  const { updateUser, loading, data: updatedUserData } = useUpdateUser()
  const {
    upload: uploadImg,
    uploading: imgUploading,
    isUploaded: imgUploaded,
    percentUploaded: imgPercentUploaded,
    // isValid: imgValid,
    // errorMessage: imgErrorMessage,
    filename: avatar
  } = useFileUpload({ bucket: IMG_BUCKET, message: "You must choose an avatar.", headers: { public: true } })

  const logout = () => {
    logOutMutation()
    client.resetStore()
    dispatch({ type: LOG_OUT })
    navigate(AppRoutes.pages.home)
  }

  useEffect(() => {
    if (updatedUserData) {
      const userData = updatedUserData.updateUser

      dispatch({ type: UPDATE_USER, payload: { data: userData } })

      const { id, name, email, telephone } = userData

      reset({ id, name, email, telephone })

      setShouldEdit(false)
    }

    // eslint-disable-next-line
  }, [updatedUserData])

  const handleUpdateUser = (values: FormData) => {
    const user: UserFormData = {
      ...values,
      avatar,
    }

    if (avatar) {
      user.img_bucket = IMG_BUCKET
    }

    // console.table(user)
    updateUser(user)
  }


  const handleInvalidImageSize = (filesize: number) => {
    setOpenInvalidFileSize(`
		The file size exceeds 1 MB. <br />
		Choose another one or reduce the size to upload.
	`)
  }

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => { uploadImg(getFile(event)) }

  return (
    <CheckAuth sx='react-transition scale-in'>
      <SEO title={`Your Account`} />
      {userData && (
        <>
          <HeaderTitle
            icon={(
              <Avatar style={{ width: 75, height: 75 }} alt={userData.name} src={userData.avatar_url} />
            )}
            textStyle={{ paddingLeft: 10 }}
            text={userData.name}
          />

          {shouldEdit ? (
            <>
              <HeaderTitle icon={<EditIcon />} text={`Edit Your Profile`} />

              <form onSubmit={handleSubmit(handleUpdateUser)} noValidate>
                <input type="hidden" ref={register({ name: "id", required: true })} />

                <Grid container direction='row' spacing={2}>
                  <Grid item xs={12} sm>
                    <TextField
                      inputRef={register({
                        required: "Your name is required.",
                      })}
                      name="name"
                      id="name"
                      label="Name"
                      type="text"
                      margin="normal"
                      error={!!errors.name}
                      helperText={errors.name && (
                        <TextIcon
                          icon={<ErrorIcon sx={styles.errorColor} />}
                          text={<span sx={styles.errorColor}>{errors.name.message}</span>}
                        />
                      )}
                      style={{ marginBottom: 15 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm>
                    <TextField
                      inputRef={register({
                        required: "Your email is required.",
                      })}
                      name="email"
                      id="email"
                      label="Email"
                      type="email"
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email && (
                        <TextIcon
                          icon={<ErrorIcon sx={styles.errorColor} />}
                          text={<span sx={styles.errorColor}>{errors.email.message}</span>}
                        />
                      )}
                      style={{ marginBottom: 15 }}
                    />
                  </Grid>
                </Grid>
                <Grid container direction='row' spacing={2}>
                  <Grid item xs={12} sm>
                    <TextField
                      inputRef={register({
                        required: "Your phone number is required.",
                        minLength: {
                          value: 8,
                          message: "The phone number must be at least 8 characters."
                        }
                      })}
                      name="telephone"
                      id="telephone"
                      label="Phone"
                      type="text"
                      margin="normal"
                      error={!!errors.telephone}
                      helperText={errors.telephone && (
                        <TextIcon
                          icon={<ErrorIcon sx={styles.errorColor} />}
                          text={<span sx={styles.errorColor}>{errors.telephone.message}</span>}
                        />
                      )}
                      style={{ marginBottom: 15 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm>
                    <TextField
                      inputRef={register({
                        minLength: {
                          value: 6,
                          message: "The password must be at least 6 characters."
                        }
                      })}
                      name="password"
                      id="password"
                      label="New Password"
                      type="password"
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password && (
                        <TextIcon
                          icon={<ErrorIcon sx={styles.errorColor} />}
                          text={<span sx={styles.errorColor}>{errors.password.message}</span>}
                        />
                      )}
                      style={{ marginBottom: 15 }}
                    />
                  </Grid>
                </Grid>

                <Grid container direction='row' spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Grid container direction='row' alignItems='center' spacing={1} sx={styles.uploadButton}>
                      <Grid item xs={9}>
                        <UploadButton
                          allowedFileSize={MAX_IMG_FILE_SIZE()}
                          onFileSizeInvalid={handleInvalidImageSize}
                          buttonSize='large'
                          accept="image/*"
                          onChange={handleImageUpload}
                          title="Choose your avatar"
                          disabled={imgUploaded}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={3}>
                        {imgUploaded && <CheckCircleIcon sx={styles.successColor} />}
                      </Grid>
                    </Grid>

                    {imgPercentUploaded > 0 && imgPercentUploaded < 100 && (
                      <ProgressBar
                        variant="determinate"
                        color="secondary"
                        value={imgPercentUploaded}
                      />
                    )}
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  size='large'
                  style={{ marginTop: 15 }}
                  disabled={imgUploading || loading}>Update Profile</Button>
                {' '}
                &nbsp;
                {' '}
                <Button
                  type="button"
                  size='large'
                  style={{ marginTop: 15 }}
                  sx={styles.noBgButton}
                  onClick={() => setShouldEdit(false)}>
                  Cancel
                </Button>
              </form>

              <AlertDialog
                open={!!openInvalidFileSize}
                handleClose={() => setOpenInvalidFileSize('')}>
                <DialogContentText id="alert-dialog-description" align='center'>
                  <span>
                    <ErrorIcon style={{ fontSize: 64 }} sx={styles.errorColor} />
                  </span>
                  <br />
                  <span dangerouslySetInnerHTML={{ __html: openInvalidFileSize }} />
                  <br />
                  <br />
                  <Button
                    size='small'
                    onClick={() => setOpenInvalidFileSize('')}
                    color="primary">
                    OK
                  </Button>
                </DialogContentText>
              </AlertDialog>
            </>
          ) : (
            <>
              <p>
                <i>Email</i>: <b>{userData.email || NOT_AVAILABLE}</b>
              </p>

              <p>
                <i>Telephone</i>: <b>{userData.telephone || NOT_AVAILABLE}</b>
              </p>

              <p>
                <i>Account created on</i>: <b>{getFormattedDate(userData.created_at) || NOT_AVAILABLE}</b>
              </p>

              <p>
                <Button
                  size='large'
                  onClick={() => setShouldEdit(true)}
                  sx={styles.noBgButton}>
                  Edit Profile
                </Button>
              </p>
              <Divider.HR style={{ width: 300, marginLeft: 0 }} />
              <p>
                <Button
                  size='large'
                  onClick={logout}
                  sx={styles.noBgButton}>
                  Log out
                </Button>
              </p>
            </>
          )}
        </>
      )
      }
    </CheckAuth>
  )
}
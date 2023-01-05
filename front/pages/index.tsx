import { Container, IconButton, InputBase, Paper } from '@material-ui/core'
import styles from '../styles/Home.module.css'
import SendIcon from '@mui/icons-material/Send'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";

export const TopImage: React.FC = () => (
  <img className={styles.bg} src="/24to_20220830RI-20.jpg" alt="img" />
)

export default function Home() {
  const router = useRouter()
  const [password, setPassword] = useState<string>('')
  const [sessionKey, setSessionKey] = useState<string>('')

  const onclick = async () => {
    const sessionKey = await fetch(
      'https://rruqurz42h.execute-api.ap-northeast-1.amazonaws.com/auth',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })
      .then(res => res.json())
      .then(({ sessionKey }) => setSessionKey(sessionKey))
  }

  useEffect(() => {
    if (sessionKey) {
      router.push({
        pathname: "gallery",
        query: { sessionKey }
      })
    }
  }, [sessionKey])

  return (
    <>
      <div>
        <TopImage />
      </div>


      <Container maxWidth="sm">
        <Paper component="form" className={styles.password}>
          <div className={styles.description}>{"Thank you for comming our wedding\n\n結婚式の写真です"}</div>
          <InputBase
            placeholder="Password"
            inputProps={{ 'aria-label': 'password' }}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setPassword(e.target.value)}
          />
          <IconButton type="button" onClick={onclick} className={styles.icon} aria-label="search">
            <SendIcon />
          </IconButton>
        </Paper>
      </Container>
    </>
  )
}

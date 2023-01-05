import { Container, IconButton, InputBase, Paper, TextField } from '@material-ui/core'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

export const TopImage: React.FC = () => (
  <Image src="/24to_20220830RI-20.jpg" layout='fill' objectFit='contain' alt="img" />
)

const onclick = () => {
  console.log('clicked')
}

export default function Home() {
  const [password, setPassword] = useState<string>('')
  return (
    <>
      <div className={styles.bg}>
        <TopImage />
      </div>


      <Container maxWidth="sm">
        <Paper component="form" className={styles.password}>
          <div className={styles.description}>{"写真置き場"}</div>
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

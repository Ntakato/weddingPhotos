import { Backdrop, ImageList, ImageListItem, Modal } from '@material-ui/core'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";

export default function Gallery() {
  const router = useRouter()
  const sessionKey = typeof router.query.sessionKey === 'string' ? router.query.sessionKey : ''
  const [itemData, setItemData] = useState([])
  const [targetNumber, setTargetNumber] = useState<number>()

  useEffect(() => {
    if (!sessionKey) {
      router.push('/')
    }
  }, [])
  useEffect(() => {
    const fetchImageUrls = async () => await fetch(
      'https://rruqurz42h.execute-api.ap-northeast-1.amazonaws.com/images',
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: sessionKey
        },
      })
      .then(res => res.json())
      .then(({ signedUrls }) => setItemData(signedUrls?.filter((url: string) => !url.includes('/?'))))
    fetchImageUrls()
  }, [])

  return (
    <div>
      <ImageList rowHeight={160} className={styles.imageList} cols={3}>
        {itemData.map((img, i) => (
          <ImageListItem key={img} cols={1}>
            <img src={img} alt={`${i} image`} onClick={() => { setTargetNumber(i) }} />
          </ImageListItem>
        ))}
      </ImageList>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={styles.modal}
        open={targetNumber !== undefined}
        onClose={() => setTargetNumber(undefined)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <img className={styles.modalImage} src={itemData[targetNumber || 0]} alt={`${targetNumber} image`} />
      </Modal>
    </div>
  )
}

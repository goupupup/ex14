import React, { useEffect } from 'react'
import { useState } from 'react'
import {Col, Row, Card, Form, InputGroup, Button} from 'react-bootstrap'
import {app} from '../firebaseInit'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage'

const MyPage = ({history}) => {
    const [loading, setLoading] = useState(false);
    const db = getFirestore(app);
    const storage = getStorage(app);

    const [image, setImage] = useState('https://via.placeholder.com/200x200')
    const [file, setFile] = useState(null);
    
    const uid = sessionStorage.getItem('uid');
    const [form, setForm] = useState({
        name:'무기명',
        phone: '010-1010-1010',
        address: '인천 서구 경서동',
        image:'https://via.placeholder.com/200x200',
        photo:''
    });
    const {name, phone, address, photo} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onChangeFile = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0]);
    }

    const getUser = async() => {
        setLoading(true);
        const user = await getDoc(doc(db, 'user', uid));
        setForm(user.data());
        setImage(user.data().photo? user.data().photo : 'https://via.placeholder.com/200x200');
        setLoading(false);
    }

    const onUpdate = async() => {
        setLoading(true);
        if(!window.confirm('수정된 내용을 저장하실래요?')) return;
        if(file){
            const snapshot = await uploadBytes(ref(storage, `/photo/${Date.now()}.jpg`), file);
            const url = await getDownloadURL(snapshot.ref);
            await setDoc(doc(db, 'user', uid), {...form, photo:url});
        }else{
            await setDoc(doc(db, 'user', uid), form);
        }
        setLoading(false);
        history.push('/');
    }

    useEffect(()=>{
        getUser();
    },[]);

    if(loading) return <h1 className = 'text-center'>로딩중입니다.</h1>

    return (
        <Row className='my-5'>
            <Col>
                <h1 className='text-center mb-5'>회원정보</h1>
                <Card className='p-5'>
                    <Form>
                        <InputGroup className='my-2'>
                            <InputGroup.Text className='px-5'>메일</InputGroup.Text>
                            <Form.Control readOnly
                                value={sessionStorage.getItem('email')}/>
                        </InputGroup>
                        <InputGroup className='my-2'>
                            <InputGroup.Text className='px-5'>이름</InputGroup.Text>
                            <Form.Control 
                                onChange={onChange} name="name"
                                value={name}/>
                        </InputGroup>
                        <InputGroup className='my-2'>
                            <InputGroup.Text className='px-5'>전화</InputGroup.Text>
                            <Form.Control 
                                onChange={onChange} name="phone"
                                value={phone}/>
                        </InputGroup>
                        <InputGroup className='my-2'>
                            <InputGroup.Text className='px-5'>주소</InputGroup.Text>
                            <Form.Control 
                                onChange={onChange} name="address"
                                value={address}/>
                        </InputGroup>
                        <div className='my-2'>
                            <img src={image} width="25%" className='my-2'/>
                            <Form.Control 
                                onChange={onChangeFile}
                                type="file"/>
                        </div>
                        <div className='text-center my-2'>
                            <Button className='px-5' onClick={onUpdate}>정보수정</Button>
                        </div>    
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default MyPage
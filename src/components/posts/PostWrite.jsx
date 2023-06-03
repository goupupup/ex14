import { set } from 'firebase/database';
import moment from 'moment'
import React, { useState } from 'react'
import {Row, Col, Button, Form} from 'react-bootstrap'
import {app} from '../../firebaseInit'
import {getFirestore, addDoc, collection} from 'firebase/firestore'

const PostWrite = ({history}) => {

    const db = getFirestore(app);

    const [form, setForm] = useState({
        email : sessionStorage.getItem('email'),
        title : '타이틀',
        body : '바디',
        date : '0000-00-00 00:00:00'
        // moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    });
    
    const {email, title, body, date} = form;

    const onchange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if(title==='' || body===''){
            alert('제목과 내용을 입력하세요.')
        }else{
            //firebase에 저장   
            if(window.confirm('저장하실래요?')){                  
                //console.log(form);
                await addDoc(collection(db,'posts'), {
                    ...form,
                    date : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                } );
                history.push('/posts');
            }
        }
    }

    return (
        <Row className='my-5'>
            <Col>
                <h1 className = 'text-center mb-5'>글쓰기</h1>
                <Form onSubmit={onSubmit}>
                    <Form.Control name = 'title' value={title}
                        className='my-2'
                        placeholder='제목을 입력하세요.'
                        onChange={onchange}/>
                    <Form.Control name = 'body' value={body}
                        onChange={onchange}
                        placeholder='내용을 입력하세요.'
                        className='my-2'
                        as='textarea'
                        rows={10}/>
                    <div className = 'text-center'>
                        <Button type = 'submit' className = 'mx-2 my-2'>글저장</Button>
                        <Button type = 'reset' className = 'mx-2 my-2' variant='secondary'>취소</Button>
                    </div>
                </Form>
            </Col>
        </Row>
    )
}

export default PostWrite
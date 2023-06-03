import React, { useEffect, useState } from 'react'
import {Row, Col, Table, Button} from 'react-bootstrap'
import {app} from '../firebaseInit'
import { getDatabase, ref, onValue, remove } from 'firebase/database'
import Book from './Book';

const CartPage = () => {
    const uid = sessionStorage.getItem('uid');
    const db = getDatabase(app);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

     const onRemove = (key) => {
        if(window.confirm(key + '번 즐겨찾기를 삭제하시겠습니까 ? ')){
            remove(ref(db,`cart/${uid}/${key}`));
        }
    }

    const getBooks = () => {
        setLoading(true);
        onValue(ref(db, `cart/${uid}`), (snapshot)=>{
            let rows=[];
            snapshot.forEach(row=>{
                rows.push({key:row.key, ...row.val()});
            });
            console.log(rows);
            setBooks(rows);
            setLoading(false);
        });
    }

    useEffect(()=>{
        getBooks();
    },[]);

    if(loading) return <h1 className = 'text-center my-5'>로딩중입니다...</h1>
    return (
       <Row>
            <Col>
                <h1 className= 'text-center my-5'>장바구니</h1>
                <Table>
                    <thead>
                        <tr>
                            <td>제목</td>
                            <td>가격</td>
                            <td>보기</td>
                            <td>삭제</td>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book =>
                            <tr key={book.key}>
                                <td>{book.title}</td>
                                <td>{book.price}</td>
                                <td><Book book = {book}/></td>
                                <td><Button className='btn-sm' variant='danger' onClick={()=> onRemove(book.key)}>삭제</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Col>
       </Row>
    )
}

export default CartPage
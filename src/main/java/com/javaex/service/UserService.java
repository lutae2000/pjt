package com.javaex.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.javaex.dao.UserDao;
import com.javaex.vo.std_info_vo;

@Service
public class UserService {
	
	@Autowired
	UserDao userDao;
	
	public List<std_info_vo> getAllList(){
		return userDao.getAllList();
	}
	
	public List<std_info_vo> getSearchList(String searchKwd){
		return userDao.searchedList(searchKwd);
	}

}

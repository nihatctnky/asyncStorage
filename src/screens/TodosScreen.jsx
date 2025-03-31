import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddCircle, BagTick, CloseCircle, Edit2, TickCircle } from 'iconsax-react-native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import uuid from 'react-native-uuid';

const TodosScreen = () => {
  // Kullanıcı tarafından girilen todo ögesini saklamak için state
  const [todo, setTodo] = useState("");

  // Todo listesini saklamak için kullanılan state
  const [todos, setTodos] = useState([]);

  // Todos listesini AsyncStorage'a kaydetme fonksiyonu
  const saveTodos = async (saveTodo) => {
    try {
      // Todos verisini AsyncStorage'a kaydetme (JSON.stringify ile JSON formatında kaydediyoruz)
      await AsyncStorage.setItem("todos", JSON.stringify(saveTodo));

      console.log("Todos kaydedildi:", saveTodo);  // Kaydedilen veriyi konsola yazdırıyoruz.
    } 
    
    catch (error) {
      console.log("Error while saving todos:", error);  // Hata durumunda konsola yazdırıyoruz.
    }
  };

  // Yeni bir todo eklemek için kullanılan fonksiyon
  const addTodo = () => {
    if (todo) {
      const newTodo = { id: uuid.v4(), text: todo };
      const updatedTodos = [...todos, newTodo];
      
      setTodos(updatedTodos); // State'i güncelliyoruz.
      saveTodos(updatedTodos); // AsyncStorage'a kaydediyoruz.

      setTodo(""); // Input'u temizliyoruz.
    } else {
      console.log("Todo girmediniz!");  // Eğer todo girilmemişse, uyarı veririz.
    }
  };

  // AsyncStorage'dan todos listesini yükleme fonksiyonu
  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem("todos");
      if (storedData) {
        setTodos(JSON.parse(storedData)); // Eğer veri varsa, JSON.parse ile objeye dönüştürüp set ediyoruz.
      }
    } catch (error) {
      console.log("Error while loading todos:", error);  // Hata durumunda konsola yazdırıyoruz.
    }
  };
  
  //bir todo ögesinin tamamlanma durumunu degiştirme fonksiyonu

  const completeTodo= id => {
    //todo listesini mapleyerek id eşleşen ögeyi blma

    const updateTodos = todos.map(item => item.id===id ?{...item, completed:
      !item.completed} : item,)

      // todo listesini güncelliyoruz
      setTodos(updateTodos)

      //yeni listeyi asyncstore kayddediyoruz

      saveTodos(updateTodos)
    
  }

   // silme butonu 

   
  const deleteTodo = id => {

    // silinicek todoyu filtreliyoruz

    const updatedTodos = todos.filter(item => item.id !== id)

    // todo listesini güncelle

    setTodos(updatedTodos)

    // yeni llisteyi asyncstroga kaydet 

    saveTodos(updatedTodos)
  }


  // Düzenleme 

  const updateTodos = id => {
    const exitingTodo = todos.find(x => x.id === id)
    if(!exitingTodo) return;


    // Kullanıcıdan yeni todo metnini almak için alert proppt açıyoruz

    Alert.prompt (
      "Edit Todo", // Başlık
      "Update", // update
      newUpdateText => {
        if(newUpdateText) {
         const updatedTodos = todos.map(item => 
          item.id === id ? {...item, text: newUpdateText} : item,
         )
         setTodos(updatedTodos)
         saveTodos(updatedTodos)
       }
     },
     'plain-text',
     exitingTodo.text,

    )
    
  }
  







  // Uygulama ilk açıldığında todos listesini yüklemek için useEffect kullanıyoruz
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <LinearGradient colors={['#fef3c7', '#a78bfa']} style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}>TO-DO LIST</Text>

        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setTodo}
            value={todo}
            placeholder='Type a Todo'
            style={styles.input}
          />

          <TouchableOpacity
            onPress={addTodo}  // Add button'a tıklandığında addTodo fonksiyonu çalışacak.
            style={[styles.button, styles.addButton]}>
            <Text style={styles.buttonText}>
              <AddCircle size="32" color="#FF8A65" variant='Broken' />
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <Text style={[styles.todoText,item.completed && styles.completedTex]}>{item?.text}</Text>

             {/* Todo ögesine ait butonlar */}
              <View style={{flexDirection: "row"}}>

                {/* Tamamlama butonu */}

                <View >
                  <TouchableOpacity style={[styles.button,styles.completeButton]}  onPress={()=>completeTodo(item?.id)}>
                    <Text >

                      {/* tamamlanmışsa x ikonu tamamlanmamışsa onay işareti */}

                      {
                       item.completed ? (
                        <CloseCircle
                        size="24"
                        color="#FF8A65"
                        variant="Broken"/>
                       ) : (

                        <TickCircle
                        size="27"
                        color="#FF8A65"
                        variant="Broken"/>

                       )
                      }

                    </Text>
                  </TouchableOpacity>

                </View>

              {/* SİLME BUTONU */}

               <View >
                <TouchableOpacity onPress={() => deleteTodo(item?.id)} style={[styles.button,
                  styles.deleteButton
                ]}>
                  <Text>
                    <BagTick size="27" color="#FF8A65" variant="Broken"/>
                  </Text>

                </TouchableOpacity>

               </View>




               {/* düzenleme butonu */}

                <View >
                  <TouchableOpacity 
                  onPress={() => updateTodos(item?.id)}
                  style={[styles.button, styles.updateButton]}>
                    <Text>
                    <Edit2 size="27" color="#FF8A65" variant='Broken'/>
                    </Text>
                  </TouchableOpacity>
                </View>



              </View>

            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default TodosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "gray",
    flex: 1,
  },
  button: {
    marginLeft: 10,
    borderRadius: 5,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
 
  todoItem: {
    flexDirection:"row",
    marginTop: 15,
    justifyContent:"space-between",
  },
  todoText: {
    color:"#000",
    textDecorationLine:"none",
    fontSize: 18,
    fontWeight:"bold"
  },
  
 
  completeButton:{
   padding: 10
  },
  deleteButton: {
    padding: 10
  },
  completedTex: {
    textDecorationLine:"line-through",
    color:"gray",
  },
  updateButton: {
    padding: 10
  },
});

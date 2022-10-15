class Todo {
  id: string;
  text: string;
  // 미리 프로퍼티를 정의하고 해당 프로퍼티에 어떤 타입을 가진 값이 저장되는지 써 주어야 한다.

  constructor(todoText: string) {
    this.text = todoText;
    this.id = new Date().toISOString();
  }
}

export default Todo;
